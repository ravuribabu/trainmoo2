'use strict';


var angular = require('angular')
var classModule = angular.module('class')
var utils = require('utils') //../../core/utils

classModule.controller('classUserController',
	function($scope, $state, $rootScope, $stateParams, classFactory, user, $uibModalInstance, SweetAlert, alertify){

		$scope.user = user;
		$scope.addToClass = false;

		if ($scope.user.clazz){
			$scope.addToClass = true;
		}


		$scope.form = new utils.AppForm(angular, function(form){

				if ($scope.user.program) {
					$scope.user.class = $scope.user.program;
				}
				if ($scope.user._id){
					classFactory.updateUser($stateParams.classid, $scope.user)
							.success(function(msg){
								alertify
								    .reset()
								    .maxLogItems(2)
								    .closeLogOnClick(true)
								    .delay(2000)
								    .logPosition("bottom left")
								    .success("User is updated successfully");

								$uibModalInstance.close();
							})
							.error(function(err){
								SweetAlert.swal('error', err);
							});
				} else {
					classFactory.addUser($stateParams.classid, $scope.user)
							.success(function(msg){
								alertify
								    .reset()
								    .maxLogItems(2)
								    .closeLogOnClick(true)
								    .delay(2000)
								    .logPosition("bottom left")
								    .success("User is added successfully");

								$uibModalInstance.close();
							})
							.error(function(err){
								SweetAlert.swal('error', err);
							});
				}

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
