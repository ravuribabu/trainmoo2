'use strict';


var angular = require('angular')
var classModule = angular.module('class')

classModule.controller('classUsersController',
	function($scope, $state, $rootScope, $stateParams, $uibModal, $aside, classFactory){


		$scope.classid = $stateParams.classid;


		$scope.userType = 'student';


		$scope.filterUser = function(type) {
			$scope.selectedUsers = [];
			_.forEach($scope.users, function(user, index){
				if (user.type && user.type === type) {
					$scope.selectedUsers.push(user);
				}
			});
			$scope.userType = type;
		}

		init();
		function init(){


			classFactory.getClass($scope.classid)
					.success(function(clazz){
						$scope.clazz = clazz;
					})
					.error(function(err){
						console.log(err);
					});
			loadUsers('student')
		}


		function loadUsers(role){
			classFactory.getUsers($scope.classid)
					.success(function(users){
						$scope.users = users;
						if (role){
							$scope.filterUser(role);
						}
					})
					.error(function(err){
						console.log(err);
					});
		}

		$scope.edit = function(user) {

			if (!user.program) {
				user.program = user.class;
			}
			$scope.classUser = user;

			openModal();
		}

		$scope.add = function(role, user) {

				$scope.classUser = {
					email: '',
					firstname: 'new',
					lastname: 'user',
					type: role,

				}

				if ($scope.clazz.programid) {
					//add class and program
				} else {
					$scope.classUser.program = {
						id: $scope.clazz._id,
						name: $scope.clazz.name
					}
				}

		        openModal();

			};

		function openModal(){

			var modalInstance = $uibModal.open({
		            templateUrl: 'assets/js/class/users/classUser.html',
		            placement: 'right',
		            size: 'md',
		            backdrop: true,
		            controller: 'classUserController',
		            resolve: {
		            	'user': $scope.classUser
		            }
		        });

		        modalInstance.result.then(function(r){
		        	console.log(r);
		        	loadUsers($scope.userType);
		        });
		}


	});
