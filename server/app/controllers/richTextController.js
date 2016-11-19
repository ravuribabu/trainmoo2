"use strict";

var Post = require('../models/post').Post;
var User = require('../models/user').User;
var Jimp = require("jimp");
var flow = require('./flowPersister.js')('tmp');
let RichText = require('../models/richText').RichText;
var _ = require('lodash');
var async = require('async');

//For any user there should be only one draft
//user draft is always automatically created when user requests
//when published updated draft with status and with correspong postid
module.exports = function(router) {

	router.route('/richtext/draft')
		  .get(function(req, res){

		  	const user = req.user;
		  	RichText.find({author: user, type: 'Draft'})
		  			.populate('author')
		  			.exec(function(err, draft){
		  				if (err) {
		  					res.status(500).send(err);
		  					return;
		  				}

		  				//If there is no draft create one and return
		  				if (draft && draft.length > 0) {
		  					res.status(200).send(draft[0]);
		  				} else {
		  					let draft = {
		  						type: 'Draft',
		  						author: user,
		  					};
		  					RichText.create(draft, function(err, rt) {
		  						if (err) { 
		  							res.status(500).send(err); 
		  							return;
		  						}
		  						rt.author = user;
		  						res.status(200).send(rt);
		  					})

		  				}

		  			});

		  })
		  

	
	router.route('/richtext/{id}')
		  .get(function(req, res){

		  	RichText.findById(req.params.id)
		  			.populate('author')
		  			.exec(function(err, draft) {
					  		if (err) {
					  			res.status(500).send(err);
					  			return;
					  		}
					  		res.status(200).send(draft);
					  	});

		  });


	router.route('/richtext')
		  .put(function(req, res){
		  	let draftReq = req.body;
		  	RichText.findById(draftReq._id, function(err, draft) {
		  		if (err) {
		  			console.log(err);
		  			res.status(500).send(err);
		  			return;
		  		}
		  		Object.assign(draft, draftReq);
		  		draft.save(function(err, d) {
		  			if (err) {
		  				console.log(err);
			  			res.status(500).send(err);
			  			return;
			  		}
			  		res.status(200).send(d);
		  		});

		  	});
		  });
};
