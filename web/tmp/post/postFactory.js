'use strict';

var post = require('angular').module('post');

post.factory('postFactory', function($http){

	return {

		createPost: function(post, user_id) {
			return $http.post('api/posts/1'   , post );
		},
		// updatePost: function(post_id, post) {
		// 	return $http.put('api/post/' + post_id , post )
		// },
		// deletePost: function(post_id) {
		// 	return $http.delete('api/post/' + post_id  )
		// },
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
		// getWall: function(user_id) {
		// 	return $http.get('api/wall/' + user_id )
		// },
		// getPicture: function(pictureid) {
		// 	return $http.get('api/img/download/' + pictureid);
		// }

	};

});
