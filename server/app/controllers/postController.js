"use strict";
var Post = require('../models/post').Post;
var User = require('../models/user').User;
var RichText = require('../models/richText').RichText;

var Jimp = require("jimp");
var flow = require('./flowPersister.js')('tmp');
var _ = require('lodash');
var async = require('async');

module.exports = function(router) {

	router.route('/replies/:post_id')
			.get(function(req, res) {
			  	Post.find({parent : req.params.post_id})
			  		.populate('author')
				  	.exec(function(err, posts){
				  		if (err) {
				  			console.log('error ' + err);
				  			res.send(err);
				  		} else {
				  			res.json(posts);
				  		}
				  	});
			  });


	router.route('/posts')
			.post(function(req, res){
				var postJson = req.body;
				console.log('USER: ' + JSON.stringify(req.user));
				postJson.author = req.user;
				Post.create(postJson, function(err, post){
					if (err) {
						console.log('Could not create post: ' + err);
						res.status(500).send(err);
					}
					else {
						res.send(post);
						if (postJson.richtext) {
							const draftReq = postJson.richtext;
							RichText.findById(draftReq._id, function(err, draft) {
							  		if (err) {
							  			console.log(err);
							  			return;
							  		}
							  		Object.assign(draft, draftReq);
							  		draft.save(function(err, d) {
							  			if (err) {
							  				console.log(err);
								  			return;
								  		}
							  		});

							  	});
						}
					}
				});
			})
			.get(function(req, res) {

			//	console.log('REQUEST USER: ' + req.user.user_id);

			  	Post.find({ parent : null})
			  		.populate('author')
			  		.populate('richtext')
			  		.sort({created_at : -1})
				  	.exec(function(err, posts){
				  		if (err) {
				  			console.log('error ' + err);
				  			res.send(err);
				  		} else {
				  			res.set("Connection", "close");
				  			res.json(posts);
				  		}
				  	});
			  });


	router.route('/post/:postid')
			.get(function(req, res) {
			  	Post.findById(req.params.postid, function(err, post){
			  		if (err) {
			  			res.send(err);
			  		} else {
			  			res.set("Connection", "close");
			  			res.json(post);
			  		}
			  	});

			  });


	router.route('/post/:postid/like/:userid')
			.put(function(req, res) {

				async.parallel([function(callback){
							Post.findById(req.params.postid, function(err, post){
							  		callback(err, post);
							  	});
						}, function(callback) {
							User.findById(req.params.userid, function(err, user){
							  		callback(err, user);
							  	});

						}],
						function(err, results ) {
							if (err) {
								res.send(err);
							} else {
								var post = results[0];
								var user = results[1];

								var alreadyLiked = _.find(post.likes, function(l) {
									return l.id.equals(user._id);
								});
								if (!alreadyLiked) {
									post.likes.push({
										id: user._id,
										name: user.shortname
									});

									post.save(function(err){
										if (err){
											console.log(err);
										} else {
											res.send('Liked Successfully');
										}
									})
								}
							}
						}
					);


			  });

};
