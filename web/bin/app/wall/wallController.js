'use strict';

var wall = require('angular').module('wall');
var moment = require('moment');

wall.controller('wallController',
	function($scope, $rootScope, $stateParams, postFactory, userFactory){
		
		var _ = require('lodash');
		let vm = this;
		
		
		init();
		function init() {
			// $scope.userid = $stateParams.userid;

			// userFactory.getUser($scope.userid)
			// 			.success(function(user){$scope.user = user;})
			// 			.error(function(err){console.log(err);})

			//loadMessages();
		}

		$rootScope.$on('POST_CREATED', function(event) {
			loadMessages(vm.classids, vm.postType);
		})


		$rootScope.$on('WALL_NAV_CHANGED', function(event, criteria) {
			event.stopPropagation();
			$scope.$broadcast('WALL_NAV_CHANGED', criteria);

			let classids = [];
			criteria.program && classids.push(criteria.program.id);
			criteria.class && classids.push(criteria.class.id);
			if (!criteria.program && !criteria.class) {
				classids = criteria.programs.map(function(p) {return p.id;});
				classids = classids.concat(criteria.classes.map(function(p) {return p.id;}));
			}

			const postType = criteria.postType?criteria.postType.name:'';
			vm.classids = classids;
			vm.postType = postType;
			loadMessages(classids, postType);
		})

		function loadMessages(classids, postType){

			postFactory.getPosts(classids, postType)
			   .success(function(data){
				   	$scope.posts = data;
			   })
			   .error(function(err){
			   	console.log(err);
			   });
		}

		$scope.loadMessages = loadMessages;

	});
