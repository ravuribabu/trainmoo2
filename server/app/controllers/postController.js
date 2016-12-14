"use strict";
var Post = require('../models/post').Post;
var PostSchema = require('../models/post').PostSchema;
var User = require('../models/user').User;
var RichText = require('../models/richText').RichText;
var mongoose = require('mongoose');

var deepPopulate = require('mongoose-deep-populate')(mongoose);
PostSchema.plugin(deepPopulate, {
									  whitelist: [
									    'replies.author',
									    'replies.parent'
									  ]
									});

var _ = require('lodash');
var async = require('async');

module.exports = function(router) {

	router.route('/replies/:post_id')
			.get(function(req, res) {
			  	Post.find({parent : req.params.post_id})
			  		.populate('author')
			  		.populate('parent')
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
				postJson.author = req.user;
				Post.create(postJson, function(err, post){
					if (err) {
						console.log('Could not create post: ' + err);
						res.status(500).send(err);
					}
					else {
						res.send(post);

						//TODO parllelize both below
						//Save parent
						debugger;
						if (postJson.parent) {
							let parent = postJson.parent;

							Post.findById(parent, function(err, parentPost) {
								if (err) {
									console.log(err);
									return;
								}

								if (!parentPost.replies) {
									parentPost.replies = [];
								}
								parentPost.replies.push(post);


								parentPost.save(function(err, parent){
									if (err) {
										console.log(err)
									}
								})
							});


							
						}


						//Save rich text
						if (postJson.richtext) {
							const draftReq = postJson.richtext.id;
							draftReq.post = post;
							draftReq.type = 'Published';
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

				console.log('classidsRAM: ' + req.query.classids);
				console.log('postTypeRAM: ' + req.query.postType);
				
				const classids = req.query.classids.split(',').map((id) => { return mongoose.Types.ObjectId(id)});

			//TODO eager fetch replies as well
			// calculate stats for submissions ahead of the time
			// when submission was created
			// load x posts at a time based on timestamp

				let query = { 
					parent : null, 
					'classes.id' : { $in : classids}, 
				};

				if (req.query.postType ) {
					query.type = req.query.postType;
				}
				

			  	Post.find(query)
			  		.populate('author')
			  		.deepPopulate('replies.author replies.parent')
			  		.sort({created_at : -1})
				  	.exec(function(err, posts){
				  		if (err) {
				  			console.log('error ' + err);
				  			res.send(err);
				  		} else {
				  			// posts.forEach((post) => {
				  			// 	post.replies.forEach((reply) => {
				  			// 		reply.parent = post;
				  			// 	});
				  			// });

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
