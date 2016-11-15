'use strict';

var wall = require('angular').module('wall');
var moment = require('moment');
require('../../../node_modules/pdfjs-dist/build/pdf.combined');
require('../shared/ng-pdf');

wall.controller('wallController',
	function($scope, $rootScope, $stateParams, postFactory, userFactory){
			var _ = require('lodash');

		
		
		init();
		function init() {
			// $scope.userid = $stateParams.userid;

			// userFactory.getUser($scope.userid)
			// 			.success(function(user){$scope.user = user;})
			// 			.error(function(err){console.log(err);})

			loadMessages();
		}

		$rootScope.$on('POST_CREATED', function(event) {
			loadMessages();
		})


		$rootScope.$on('WALL_NAV_CHANGED', function(event, data) {
			// console.log('Received NAV Changed Event: ' + JSON.stringify(data));
			event.stopPropagation();
			$scope.$broadcast('WALL_NAV_CHANGED', data);
		})

		function loadMessages(){



			postFactory.getPosts('1234')
			   .success(function(data){
				   	$scope.posts = data;
				   	// var selection = $scope.filter.selection();
				   	// $scope.posts = _.filter($scope.posts, function(p){return (_.indexOf(selection, p.type) >= 0); });
			   })
			   .error(function(err){
			   	console.log(err);
			   });
		}

		$scope.loadMessages = loadMessages;

	});
