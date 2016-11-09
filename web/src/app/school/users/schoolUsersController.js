'use strict';


var angular = require('angular')
var school = angular.module('school')

school.controller('schoolUsersController',
	function($scope, $state, $rootScope, $stateParams, $uibModal, schoolFactory, SweetAlert){

		var _ = require('lodash');
		var vm = this;
		
		init();
		function init(){
			vm.schoolid = $stateParams.schoolid;
			vm.userType = 'student';
			refreshUsers();
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
		        text: "Are you sure you want to remove user from School!",   
		        type: "warning",   
		        showCancelButton: true,   
		        confirmButtonColor: "#DD6B55",   
		        confirmButtonText: "Yes, delete it!",   
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
					type: role,
					school: vm.schoolid
				}

		        openModal(newUser);
		};

		function openModal(user){

			var modalInstance = $uibModal.open({
		            templateUrl: 'school/users/classUser.tpl.html',
		            placement: 'right',
		            size: 'md',
		            backdrop: true,
		            controller: 'classUserController',
		            resolve: {
		            	'user': user
		            }
		        });

		        modalInstance.result.then(function(r){
		        	refreshUsers();
		        });
		}

	});
