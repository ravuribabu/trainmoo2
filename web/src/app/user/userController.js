
'use strict';

var user = require('angular').module('user');

user.config(['flowFactoryProvider', function (flowFactoryProvider) {
		  flowFactoryProvider.defaults = {
		    target: 'api/img/upload/',
		    permanentErrors: [404, 500, 501],
		    maxChunkRetries: 2,
		    chunkRetryInterval: 5000,
		    simultaneousUploads: 1,
		    uploadMethod: 'POST'
		  };
		}]);

user.controller('userController',

	function($scope, $http, $window, userFactory, $state, $timeout, SweetAlert, flowFactory, $stateParams, appForm, alertify){


		var _ = require('lodash');

		$scope.removeImage = function () {
	        $scope.noImage = true;
	    };
		$scope.userTypes = ['Student', 'Teacher', 'Parent', 'Admin'];
		$scope.select2Options = {
		    multiple: true,
		    minimumInputLength: 1,
		    formatResult: function (item) {
		        return item.text;
		    },
		    formatSelection: function (item) {
		        return item.text;
		    },
		  }

		$scope.formData = {};
		$scope.obj = {};

		$scope.fileSuccess = function($file, $message, $flow ) {
		}

		$scope.fileError = function($file, $message, $flow ) {
			SweetAlert.swal($message);
		}

		$scope.deleteAvatar = function(){
			$scope.formData.picture = null;
		}

		$scope.form = new appForm.AppForm(angular, function(form){


			if ($scope.obj.flowImages && $scope.obj.flowImages.files.length > 0) {
				var fileImg = $scope.obj.flowImages.files[0];
				var file = {
					fileid : fileImg.uniqueIdentifier,
					fileName: fileImg.name,
					size: fileImg.size,
					type: fileImg.name.split('.').pop().toLowerCase()
				}

				$scope.formData.picture = file;
				$scope.obj.flowImages.upload();
			};


			if ($scope.formData._id) {
						userFactory.put($scope.formData, $scope.formData._id)
													.success(function(message){
														alertify
														    
														    .success("User profile updated successfully");
														$state.reload();
													})
													.error(function(data){
														var errors = "\n";

														_.forEach(data.errors, function(element, index) {
															errors = errors + "\n" + index + ": " + element.message
														});

														SweetAlert.swal("The form cannot be submitted because it contains validation errors!", data.message + errors, "error");
													});
	                } 
		}, function(){
			SweetAlert.swal('Incomplete', 'User profile incomplete', 'error');
		});

		init();
		function init() {

			getUser();
		    $scope.noImage = false;
		    
		   
		}


		function getUser(id) {

			userFactory.getUser(id)
				.success(function(data){
					if (data) {
						$scope.formData = data;
						$scope.formData.password2 = data.password;
						$scope.formData.nameDisplay = $scope.formData.name.firstname + " " + $scope.formData.name.lastname ;
						$scope.formData.certificationsDisplay = _.join($scope.formData.certifications, ', ');
						$scope.formData.specializationsDisplay = _.join($scope.formData.specializations, ', ');
						$scope.formData.trainingStyleDisplay = _.join($scope.formData.trainingStyle, ', ');
					}
				})
				.error(function(err){
					console.log(err);
				});
		}
	  });
