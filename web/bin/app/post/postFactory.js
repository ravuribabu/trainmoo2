'use strict';

var post = require('angular').module('post');

post.factory('postFactory', function($http){

	return {
		getProgramsclasses: function(schoolid){
			return $http.get('api/programsclasses/' + schoolid );
		},
		createPost: function(post, user_id) {
			return $http.post('api/posts'   , post );
		},
		getPosts: function(classids, postType) {
			return $http.get('api/posts?classids=' + classids + '&postType=' + postType );
		},
		getPost: function(post_id) {
			return $http.get('api/post/' + post_id );
		},
		getReplies: function(parent_id) {
			return $http.get('api/replies/' + parent_id );
		},
		likePost: function(post_id, user_id){
			return $http.put('api/post/' + post_id + '/like/' + user_id);
		},

		getDraft: function() {
			return $http.get('api/richtext/draft')
		},
		getRichText: function(id) {
			return $http.get('api/richtext/' + id);
		},
		updateRichtext: (richtext) => {
			return $http.put('api/richtext', richtext);
		}
	};

});
