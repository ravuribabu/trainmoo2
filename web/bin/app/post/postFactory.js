'use strict';

var post = require('angular').module('post');

post.factory('postFactory', function($http){

	return {
		getProgramsclasses: function(schoolid){
			return $http.get('api/programsclasses/' + schoolid );
		},
		getClasses: function() {
			return {
				programs :
					 	[
							{	
								id: 1,
								name: 'Fullstack Developer'
							}, 
							{	
								id: 2,
								name: 'Data Scientist'
							}
						],

				classes : 
						[
							{	
								id: 1,
								name: 'Javascript',
								program: 1,
								newItems: 3
							}, 
							{	
								id: 2,
								name: 'Nodejs',
								program: 1
							}, 
							{	
								id: 3,
								name: 'Spark Introduction',
								program: 2
							}
							, 
							{	
								id: 4,
								name: 'MapReduce Programming',
								program: 2,
								newItems: 2
							}
						]

			}
		},
		createPost: function(post, user_id) {
			return $http.post('api/posts/1'   , post );
		},
		getPosts: function(user_id) {
			return $http.get('api/posts/' + user_id );
		},
		getPost: function(post_id) {
			return $http.get('api/post/' + post_id );
		},
		getReplies: function(parent_id) {
			return $http.get('api/replies/' + parent_id );
		},
		likePost: function(post_id, user_id){
			return $http.put('api/post/' + post_id + '/like/' + user_id);
		}

	};

});
