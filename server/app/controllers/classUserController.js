"use strict";
var ClassUser = require('../models/classUser').ClassUser;
var Class = require('../models/class').Class;
var SchoolUser = require('../models/schoolUser').SchoolUser;
var _ = require('lodash');
var mongoose = require('mongoose');

module.exports = function(router) {

	router.route('/class/:classid/schoolusers')
		 .get(function(req, res) {

		 //Find Class and School info
		 var p1 = new Promise(function(resolve, reject) {
		 	Class.findById( mongoose.Types.ObjectId(req.params.classid)  )
		  			.exec(function(err, claz){
			  		if (err) {
			  			reject(err); 
			  		} else {
			  			resolve(claz);
			  		}
			  	});
		 	});
		 	
		 	//Get all schooluserids for the class
		 	var p2 = new Promise(function(resolve, response){
		 		ClassUser.find( { 'class' : mongoose.Types.ObjectId(req.params.classid) } )
		  			.exec(function(err, users){
			  		if (err) {
			  			reject(err); 
			  		} else {
			  			resolve(_.map(users, function(user){return user.schoolUser}));
			  		}
			  	});
		 	});

		 	//Get schooluserids that are not already in classusers
		 	Promise.all([p1, p2])
		 			.then(function(results){
		 				var schoolid = results[0].school;
		 				var schoolUserids = results[1];
		 				SchoolUser.find({ 'school' : schoolid, '_id': {$nin: schoolUserids }})
		 					      .exec(function(err, schoolUsers) {
		 					      	if (err) {
		 					      		res.status(500).send(err);
		 					      	} else {
		 					      		res.json(schoolUsers)
		 					      	}
		 					      });
		 			});

		 	
		 });

	router.route('/class/:classid/users')
		  .get(function(req, res){
		  	ClassUser.find( { 'class' : mongoose.Types.ObjectId(req.params.classid) } )
		  			.populate('schoolUser')
		  			.exec(function(err, users){
			  		if (err) {
			  			console.log(err);
			  			res.send(err); 
			  		} else {
			  			res.json(users.map((user) => 
			  				{ 
			  					return user.schoolUser;
			  				}));
			  		}
			  	});
		  }).post(function(req, res){
		  		var userRequest = req.body;

		  		console.log('RECEIVED Add User to Class: ' + JSON.stringify(userRequest));
		  		//IF class user exists return with failure
		  		var p1 = new Promise(function(resolve, reject){

		  			let query = {};

		  			if (userRequest.email && userRequest.mobile) {
		  				query = { $or : [{ 'schoolUser.email': userRequest.email }, { 'schoolUser.mobile': userRequest.mobile }]};
		  			} else if (userRequest.email) {
		  				query = { 'schoolUser.email': userRequest.email };
		  			} else if (userRequest.mobile) {
		  				query = { 'schoolUser.mobile': userRequest.mobile };
		  			}


		  			ClassUser.find(query)
		  				 .exec(function(err, classUsers) {
		  				 	if (err) {
		  				 		console.log(err);
		  				 		reject(err);
		  				 	} else {
		  				 		if (classUsers && classUsers.length > 0) {
		  				 			console.log('User already added to classUser');
		  				 			resolve(classUsers[0]);
		  				 		} else {
  				 				  	resolve(undefined);
  				 				}
		  				 	}
		  				 });
		  		});


		  		//If school user exists, add to classuser
		  		var p2 = new Promise(function(resolve, reject){

		  			let query = {};

		  			if (userRequest.email && userRequest.mobile) {
		  				query = { $or : [{ 'email': userRequest.email }, { 'mobile': userRequest.mobile }]};
		  			} else if (userRequest.email) {
		  				query = { 'email': userRequest.email };
		  			} else if (userRequest.mobile) {
		  				query = { 'mobile': userRequest.mobile };
		  			}


		  			SchoolUser.find(query)
		  				 .exec(function(err, schoolUsers) {
		  				 	if (err) {
		  				 		console.log(err);
		  				 		reject(err);
		  				 	} else {
		  				 		if (schoolUsers && schoolUsers.length > 0) {
		  				 			console.log('User already added to schoolUser' + JSON.stringify(schoolUsers[0]));
		  				 			resolve(schoolUsers[0]);
		  				 		} else {
		  				 			SchoolUser.create(userRequest, function(err, user){
										if (err) { 
											console.log(err);
											reject(err);
										}
										else { 
											resolve(user);
										}
									}); 
		  				 		}
		  				 	}
		  				 });
		  		});
		  			

		  		//If does not exist in class and school
		  		Promise.all([p1, p2])
		  				.then(function(results){
		  					let classUser = results[0];
		  					let schoolUser = results[1];

		  					console.log('classUser: ' + JSON.stringify(classUser) + ' schooluser: ' + JSON.stringify(schoolUser));
		  					if (classUser) {
		  						res.status(409).send(classUser);
		  					} else {
		  						userRequest.schoolUser = schoolUser;

		  						let classUserNew = {
		  							schoolUser: schoolUser,
		  							class: req.params.classid,
		  							school: userRequest.school
		  						}

		  						console.log('Adding classUser: ' + JSON.stringify(classUserNew));
		  						ClassUser.create(classUserNew, function(err, user){
									if (err) { 
										console.log(err);
										res.status(500).send(err);
									}
									else { 
										res.send(user); 
									}
								}); 
		  					}
		  				});
		  		
		  }).put(function(req, res){

		  	var userRequest = req.body;

		  	console.log('userRequest:' + JSON.stringify(userRequest));
		  	SchoolUser.findById( userRequest._id , function(err, user){
		  		if (err) {
		  			res.send(err);
		  		}
		  		else {
		  			Object.assign(user, userRequest);
		  			user.save(function(err, c) {
		  				if (err) {
		  					res.send(err);
		  				}else {
		  					res.json('User updated Successfully');
		  				}
		  			});
		  		}
		  	});
		  });

	router.route('/class/user/:userid')
		.delete(function(req, res){
		  	ClassUser.remove( { 'schoolUser' : mongoose.Types.ObjectId(req.params.userid) } )
		  			.exec(function(err, users){
					  		if (err) {
					  			console.log(err);
					  			res.send(err); 
					  		} else {
					  			res.json(users);
					  		}
					  	});
		  });

	
};