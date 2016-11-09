'use strict';


var angular = require('angular')
var classModule = angular.module('school')

classModule.controller('classUserController',
	function($scope, $state, $rootScope, $stateParams, schoolFactory, user, $uibModalInstance, SweetAlert, alertify, appForm){

		
		$scope.user = user;

		$scope.form = new appForm.AppForm(angular, function(form){
			schoolFactory.saveOrUpdateSchoolUser($scope.user)
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
