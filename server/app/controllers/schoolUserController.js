"use strict";
var SchoolUser = require('../models/schoolUser').SchoolUser;
var ClassUser = require('../models/classUser').ClassUser;

var mongoose = require('mongoose');

module.exports = function(router) {

	router
		.route('/school/user/:userid')
		.delete(function(req, res){
			//TODO: Mark it inactive in shcool and all classes / programs
			var p1 = new Promise(function(resolve, reject) {
				SchoolUser.remove( { '_id' : mongoose.Types.ObjectId(req.params.userid) } ).exec(function(err, users){
			  		if (err) {
			  			reject(err);
			  		} else {
			  			resolve('success');
			  		}
			  	});
			});
		  	
			var p2 = new Promise(function(resolve, reject) {
			  	ClassUser.remove( { 'schoolUser' : mongoose.Types.ObjectId(req.params.userid) } ).exec(function(err, users){
			  		if (err) {
			  			reject(err);
			  		} else {
			  			resolve('success');
			  		}
			  	});
			});

			Promise.all([p1, p2])
					.then(results => res.status(200).json({message: 'successfully deleted'}));

		  });


	router.route('/school/:schoolid/users')
		  .get(function(req, res){
		  	SchoolUser.find( { 'school' : mongoose.Types.ObjectId(req.params.schoolid) } )
		  			  .populate('user')
		  			  .exec(function(err, users){
					  		if (err) {
					  			console.log(err);
					  			res.send(err); 
					  		} else {
					  			res.json(users);
					  		}
					  	});
		 	 })
		  .post(function(req, res){
		  		var userRequest = req.body;				
				SchoolUser.create(userRequest, function(err, user){
					if (err) { 
						res.status(500).send(err);
					}
					else { 
						res.status(200).send(user); 
					}
				}); 
		  	})
		  .put(function(req, res){

		  	var userRequest = req.body;

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
		  					res.status(200).send(user);
		  				}
		  			});
		  		}
		  	});
		  });


	
};