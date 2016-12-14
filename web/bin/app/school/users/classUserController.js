'use strict';


var angular = require('angular')
var classModule = angular.module('school')

classModule.controller('classUserController',
	function($scope, $state, $rootScope, $stateParams, schoolFactory, user, $uibModalInstance, SweetAlert, alertify, appForm){

		var vm = this;


		vm.selectUserType = (userType) => {
			vm.user.type = userType;
		}

		vm.selectRegisterType = (type) => {
			vm.user.registerUsing = type;
		}

		vm.user = user;
		vm.form = new appForm.AppForm(angular, function(form){
			schoolFactory.saveOrUpdateClassUser(vm.user)
						.success(function(msg){
										alertify
										    .success("User is updated successfully");
										$uibModalInstance.close();
									})
						.error(function(err){
							SweetAlert.swal('error', JSON.stringify(err));
						});
			}, function(){
				//SweetAlert.swal('error', 'Enter valid/required information');
			});

		$scope.ok = function(){
			$uibModalInstance.close();
		}

		$scope.cancel = function(){
			$uibModalInstance.dismiss();
		}

		console.log('here');
	});
