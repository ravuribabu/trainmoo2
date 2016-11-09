"use strict";
var Class = require('../models/class').Class;
var mongoose = require('mongoose');

module.exports = function(router) {

	router.route('/programs')
		  .get(function(req, res){
		  	Class.find( { program: null } ).exec(function(err, classes){
			  		if (err) {
			  			console.log(err);
			  			res.send(err);
			  		} else {
			  			res.json(classes);
			  		}
			  	});
		  });

	router.route('/program/:programid/classes')
		  .get(function(req, res){
		  	Class.find( { program : mongoose.Types.ObjectId(req.params.programid) } ).exec(function(err, classes){
			  		if (err) {
			  			console.log(err);
			  			res.send(err);
			  		} else {
			  			res.json(classes);
			  		}
			  	});
		  });

	router.route('/classes')
		  .post(function(req, res){
		  		var classJson = req.body;
				
				Class.create(classJson, function(err, clazz){
					if (err) { 
						console.log(err);
						res.status(500).send(err);
					}
					else { 
						res.send(clazz); 
					}
				}); 
		  });

	router.route('/class')
		  .put(function(req, res){

		  	debugger;
		  	var clazzReq = req.body;

		  	console.log('Received update request: ' + JSON.stringify(clazzReq));

		  	Class.findById( clazzReq._id , function(err, clazz){
		  		if (err) {
		  			res.send(err);
		  		}
		  		else {

		  			Object.assign(clazz, clazzReq);

		  			clazz.save(function(err, c) {
		  				if (err) {
		  					res.send(err);
		  				}else {
		  					res.json(c);
		  				}
		  			});
		  		}
		  	});
		  });

	router.route('/class/:classid')
		  .get(function(req, res){
		  	Class.findById( req.params.classid , function(err, clazz) {
		  		if (err) {
		  			res.send(err);
		  		}
		  		else {
		  			res.json(clazz);
		  		}
		  	});
		  });

    router.route('/programsclasses/:schoolid')
	  .get(function(req, res){
	  		Class.find( { school: req.params.schoolid } ).exec(function(err, classes){
			  		if (err) {
			  			console.log(err);
			  			res.send(err);
			  		} else {
			  			res.json(classes);
			  		}
			  	});
	  });
	
};