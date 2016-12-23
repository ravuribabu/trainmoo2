'use strict';


var angular = require('angular')
var school = angular.module('school')

school.controller('classUsersController',
	function($scope, $state, $rootScope, $stateParams, $uibModal, $aside, schoolFactory, SweetAlert){

		var _ = require('lodash');
		var vm = this;
		
		init();
		function init(){
			vm.classid = $stateParams.classid;
			vm.schoolid = $stateParams.schoolid;
			vm.userType = 'student';
			refreshUsers();
		}

		function refreshUsers() {
			if (vm.classid) {
				schoolFactory.getClass(vm.classid)
						.success(function(claz){
							vm.class = claz;
							vm.name = claz.name;
						})
						.error(function(err){
							SweetAlert.swal('error', JSON.stringiy(err));
						});

				schoolFactory.getClassSchoolUsers(vm.classid)
						.success(function(users){
							vm.schoolusers = users;
						})
						.error(function(err){
							SweetAlert.swal('error', JSON.stringiy(err));
						});


				schoolFactory.getClassUsers(vm.classid)
						.success(function(users){
							vm.users = users;
							populateUserTypes(users);
							setVisibleUsers();
						})
						.error(function(err){
							SweetAlert.swal('error', JSON.stringiy(err));
						});
			}

			else {

				schoolFactory.getSchool(vm.schoolid)
						.success(function(school){
							vm.school = school;
							vm.name = school.name;
						})
						.error(function(err){
							SweetAlert.swal('error', JSON.stringiy(err));
						});

				schoolFactory.getSchoolUsers(vm.schoolid)
					.success(function(users){
						vm.users = users;
						populateUserTypes(users);
						setVisibleUsers();
					})
					.error(function(err){
						SweetAlert.swal('error', JSON.stringiy(err));
					});
			}	

			


		}

		function populateUserTypes(users) {
			var userTypes = users.reduce(function(prev, item) {
								if (item.type in prev ) prev[item.type]++;
								else prev[item.type] = 1;
								return prev;
							}, {});

			vm.userTypes = [];
			for (var prop in userTypes) {
				vm.userTypes.push({
					type: prop,
					count: userTypes[prop]
				})
			}
		}


		vm.selectedUserType = undefined;
		vm.showUserType = function(userType) {
			if (vm.selectedUserType === userType) {
				vm.selectedUserType = undefined;
			} else {
				vm.selectedUserType = userType;
			}
			setVisibleUsers();
		}

		function setVisibleUsers() {
			vm.visibleUsers = vm.users.filter((user) => {
				return !vm.selectedUserType || user.type === vm.selectedUserType;
			})
		}
			
		//Select user from list - list was populated from SchoolUser
		$scope.itemSelected = function($item, $model, $label, $event){

	      var selectedUser = $item;

	      var newClassUser = {
	      	email: $item.email,
			name: $item.name,
			type: $item.type,
			'class': vm.classid,
			school: vm.schoolid
	      }
	      
	      
	      schoolFactory.saveOrUpdateUser(newClassUser)
	      				.success(function(msg){
	      					refreshUsers();
	      				})
	      				.error(function(err){
	      					SweetAlert.swal('error', JSON.stringify(err));
	      				})
	      $event.preventDefault();
	    }


		$scope.edit = function(user) {
			openModal(user);
		}

		$scope.delete = function(user) {

			if (vm.classid) {
				deleteClassUser(user);
			} else {
				deleteSchoolUser(user);
			}
			
		}

		function deleteClassUser(user) {
			SweetAlert.swal(
		      {   
		        title: "Delete user?",   
		        text: "Are you sure you want to remove user from " + vm.class.name + "!",   
		        type: "warning",   
		        showCancelButton: true,   
		        cancelButtonText: "Do not remove user",
		        confirmButtonColor: "#DD6B55",   
		        confirmButtonText: "Yes, remove from class!",   
		        closeOnConfirm: true 
		      }, 
		        function(isConfirm)
		        {   
		          if (isConfirm){
		             schoolFactory.deleteClassUser(user._id)
		             			  .success(function(){refreshUsers();})
		             			  .error(function(err){
		             			  	SweetAlert.swal('error', JSON.stringify(err));
		             			  });
		          }
		        });	
		}

		function deleteSchoolUser(user) {
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
					mobile: '',
					name: '',
					type: 'student',
					registerUsing: 'email',
					school: vm.schoolid
				}
				if (vm.classid) {
					newUser.class = vm.classid;
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

		        modalInstance.result.then(function(addedUser){
		        	refreshUsers();
		        });
		}

	});
