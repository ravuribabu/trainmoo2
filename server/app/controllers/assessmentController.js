"use strict";

var Post = require('../models/post').Post;
var User = require('../models/user').User;
var Jimp = require("jimp");
var flow = require('./flowPersister.js')('tmp');
let RichText = require('../models/richText').RichText;
var _ = require('lodash');
var async = require('async');
var Assessment = require('../models/assessment').Assessment;

//For any user there should be only one draft
//user draft is always automatically created when user requests
//when published updated draft with status and with correspong postid
module.exports = function(router) {


	router.route('/assessments/:postid')
		  .get(function(req, res){

		  	const postid = req.params.postid;
	  		Assessment.find({ post: postid })
	  				   .exec(function(err, assessments) {
	  				   		if (err) {
	  				   			res.status(500).send(err);
	  				   		} else {
	  				   			res.status(200).send(assessments);
	  				   		}
	  				   });
		  	
		  });


	router.route('/assessments')
		  .get(function(req, res){

		  	const postid = req.params.postid;
		  	const user = req.user;

	  		Assessment.find({ post : null,  created_by : mongoose.Types.ObjectId('57ebe6b426d06a66a3aabce7') })//user._id })
	  				  .exec( function(err, assessments) {
	  				  	if (err) {
	  				  		res.status(500).send(err);
	  				  	} else {
	  				  		res.status(200).send(assessments);
	  				  	}
	  				  });


		  })
		  .post(function(req, res) {

		  		const assessment = req.body;
		  		assessment.created_by =  mongoose.Types.ObjectId('57ebe6b426d06a66a3aabce7'); //req.user._id;

		  		Assessment.create(assessment, function(err, assessment) {
		  			console.log('Assessment created successfully');
		  			res.status(200).send(assessment);
		  		})
		  });

	router.route('/assessment/:assessmentid')
		  .put(function(req, res) {

		  		const assessmentReq = req.body;
		  		Assessment.findById(req.params.assessmentid)
				  		  .exec(function(err, assessment){
					  			if (err) { 
										console.log('Could not get assessment: ' + err);
										res.status(500).send(err);
									}
									else { 

										Object.assign(assessment, assessmentReq);
										assessment.save(function(err, e){
											if (err) {
												console.log('Could not get event: ' + err);
												res.status(500).send(err);
											} else {
												res.send(e); 
											}
										});
									}
				  			});

		  })
		  .delete(function(req, res) {

		  }) ;

};
