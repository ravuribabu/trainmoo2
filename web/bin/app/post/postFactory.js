'use strict';

var post = require('angular').module('post');

post.factory('postFactory', function($http){

	return {

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
