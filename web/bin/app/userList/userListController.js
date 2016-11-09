
'use strict';

var userList = require('angular').module('userList');
var _ = require('lodash');

var logit = function(data){
	console.log('ERROR: ' + data);
}


userList.controller('userListController', function($scope, $http, $window, userListFactory, $state, $timeout, SweetAlert){

		$scope.userList = [];
		$scope.searchString = "";

		init();
		function init() {

			console.log("UserListController:Init()");

			$scope.rate = 3;
		    $scope.max = 5;
		    $scope.isReadonly = false;

			userListFactory.getUsers()
				.success(function(data){
					console.log("Successfully loading users");
					_.forEach(data, function(element, index) {
						var user = {};
						user.id = element._id;
						user.name = element.name.firstname + " " + element.name.lastname ;
						user.title = element.title;
						user.certifications = _.join(element.certifications, ', ');
						user.specializations = _.join(element.specializations, ', ')
						user.trainingStyle = _.join(element.trainingStyle, ', ')
						user.experience = element.experience;
						user.costPerSession = '2000';
						user.feedbackPositive = '90';
						user.activeSessions = '1';
						user.picture = element.picture;

						$scope.userList.push(user);
					});
				})
				.error(logit);
		}

	});
