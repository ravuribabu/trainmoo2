'use strict';

var wall = require('angular').module('wall');
var moment = require('moment');

wall.controller('wallController',
	function($scope, $rootScope, $stateParams, postFactory, userFactory){

		$scope.obj = { flow : new Flow() };
		$scope.filter = {
			message: true,
			assignment: true,
			notification: true,
			blog:true,
			selection: function(){
				var selected = [];
				if (this.message) {
					selected.push('comment');
				}
				if (this.assignment) {
					selected.push('assignment');
				}
				if (this.notification) {
					selected.push('notification');
				}
				if (this.blog) {
					selected.push('blog');
				}
				return selected;
			}
		};
		init();
		function init() {
			$scope.userid = $stateParams.userid;

			userFactory.getUser($scope.userid)
						.success(function(user){$scope.user = user;})
						.error(function(err){console.log(err);})


			loadMessages();
		}

		$rootScope.$on('POST_CREATED', function(event) {
			loadMessages();
		})
		function loadMessages(){



			postFactory.getPosts('1234')
			   .success(function(data){
				   	$scope.posts = data;
				   	var selection = $scope.filter.selection();
				   	$scope.posts = _.filter($scope.posts, function(p){return (_.indexOf(selection, p.type) >= 0); });
			   })
			   .error(function(err){
			   	console.log(err);
			   });
		}

		$scope.loadMessages = loadMessages;

	});
