'use strict';


var angular = require('angular')
var school = angular.module('school')

school.controller('schoolUsersController',
	function($scope, $state, $rootScope, $stateParams, $uibModal, schoolFactory, SweetAlert, $aside){

		var _ = require('lodash');
		var vm = this;
		
		init();
		function init(){
			vm.schoolid = $stateParams.schoolid;
			vm.userType = 'student';
			refreshUsers();

			schoolFactory.getSchool(vm.schoolid)
						.success(function(school){
							vm.school = school;
							vm.name = school.name;
						})
						.error(function(err){
							SweetAlert.swal('error', JSON.stringiy(err));
						});

		}

		function refreshUsers() {
			schoolFactory.getSchoolUsers(vm.schoolid)
					.success(function(users){
						vm.users = users;
					})
					.error(function(err){
						SweetAlert.swal('error', JSON.stringiy(err));
					});
		}
		

		$scope.edit = function(user) {
			openModal(user);
		}

		$scope.delete = function(user) {
			SweetAlert.swal(
		      {   
		        title: "Delete user?",   
		        text: "Are you sure you want to remove user from " + vm.school.name + "!",   
		        type: "warning",   
		        showCancelButton: true,   
		        cancelButtonText: "Do not remove user",
		        confirmButtonColor: "#DD6B55",   
		        confirmButtonText: "Yes, remove from school!",   
		        closeOnConfirm: true 
		      }, 
		        function(isConfirm)
		        {   
		          if (isConfirm){
		             schoolFactory.deleteSchoolUser(user._id)
		             			  .success(function(){refreshUsers();})
		             			  .error(function(err){
		             			  	SweetAlert.swal('error', JSON.stringify(err));
		             			  });
		          }
		        });	
		}

		$scope.add = function(role, user) {
				var newUser = {
					email: '',
					firstname: 'new',
					lastname: 'user',
					type: 'student',
					registerUsing: 'email',
					school: vm.schoolid
				}

		        openModal(newUser);
		};

		function openModal(user){

			var modalInstance = $aside.open({
		            templateUrl: 'school/users/schoolUser.tpl.html',
		            placement: 'right',
		            size: 'md',
		            backdrop: true,
		            controller: 'schoolUserController',
		            controllerAs: 'vm',
		            resolve: {
		            	'user': user
		            }
		        });

		        modalInstance.result.then(function(r){
		        	refreshUsers();
		        });
		}

	});
