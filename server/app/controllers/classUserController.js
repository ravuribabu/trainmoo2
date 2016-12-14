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
		 				console.log('Schoolid: ' + schoolid + ' schoolUserids: ' + schoolUserids);
		 				SchoolUser.find({ 'school' : schoolid, '_id': {$nin: schoolUserids }})
		 					      .exec(function(err, schoolUsers) {

		 					      	console.log('Err: ' + err + 'SChoolusers: '+ schoolUsers);
		 					      	debugger;
		 					      	if (err) {
		 					      		res.status(500).send(err);
		 					      	} else {
		 					      		console.log('SCHOOL USERS' + schoolUsers);
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
			  			res.json(users);
			  		}
			  	});
		  }).post(function(req, res){
		  		var userRequest = req.body;

		  		console.log('RECEIVED: ' + JSON.stringify(userRequest));
		  		//IF class user exists return with failure
		  		var p1 = new Promise(function(resolve, reject){
		  			ClassUser.find({ $or : [{ email: userRequest.email }, { mobile: userRequest.mobile }]})
		  				 .exec(function(err, classUsers) {
		  				 	if (err) {
		  				 		reject(err);
		  				 	} else {
		  				 		if (classUsers && classUsers.length > 0) {
		  				 			resolve(classUsers[0]);
		  				 		}
		  				 	}
		  				 });
		  		});


		  		//If school user exists, add to classuser
		  		var p2 = new Promise(function(resolve, reject){
		  			SchoolUser.find({ $or : [{ email: userRequest.email }, { mobile: userRequest.mobile }]})
		  				 .exect(function(err, schoolUsers) {
		  				 	if (err) {
		  				 		reject(err);
		  				 	} else {
		  				 		if (schoolUsers && schoolUsers.length > 0) {
		  				 			resolve(schoolUsers[0]);
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
		  					if (classUser || schoolUser) {
		  						res.status(409).send(classUser || schoolUser);
		  					} else {
		  						ClassUser.create(userRequest, function(err, user){
									if (err) { 
										console.log(err);
										res.status(500).send(err);
									}
									else { 

										//Add user to schoolusers list as well.
										Class.findById(user.class, function(err, claz) {
											if (err) {
												return;
											}
											SchoolUser.find({ school: claz.school, email: user.email }, function(err, users) {
												if (users && users.length > 0) {
													return; //user exists
												}

												//add user
												const schoolUser = {
													school: claz.school,
													email: user.email,
													firstname: user.firstname,
													lastname: user.lastname,
													type: user.type
												};
												SchoolUser.create(schoolUser, function(err, schoolUser) {
													console.log('User is added to to school list as well');
												});
											});
										});
										res.send(user); 
									}
								}); 
		  					}
		  				});
		  		
		  }).put(function(req, res){

		  	var userRequest = req.body;

		  	ClassUser.findById( userRequest._id , function(err, user){
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
		  	ClassUser.remove( { '_id' : mongoose.Types.ObjectId(req.params.userid) } ).exec(function(err, users){
		  		if (err) {
		  			console.log(err);
		  			res.send(err); 
		  		} else {
		  			res.json(users);
		  		}
		  	});
		  });

	
};