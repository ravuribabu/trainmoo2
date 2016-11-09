
'use strict';

var user = require('angular').module('user');
var utils = require('utils');

user.controller('userController',

function($scope, $http, $window, userFactory, $state, $timeout, SweetAlert, flowFactory, $stateParams){

	$scope.removeImage = function () {
        $scope.noImage = true;
    };
    $scope.newUser = true;

	$scope.userTypes = ['student', 'teacher', 'parent', 'admin'];
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
	$scope.searchString = "";

	$scope.master = $scope.myModel;
	$scope.fileSuccess = function($file, $message, $flow ) {
		//$flow.cancel();
	}

	$scope.fileError = function($file, $message, $flow ) {
		SweetAlert.swal($message);
	}

	$scope.deleteAvatar = function(){
		$scope.formData.picture = null;
	}

	$scope.form = new utils.AppForm(angular, function(form){


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
												.success(function(){
													$state.go('app.wall' , {userid: $scope.formData._id} );
												})
												.error(function(data){
													var errors = "\n";

													_.forEach(data.errors, function(element, index) {
														errors = errors + "\n" + index + ": " + element.message
													});

													SweetAlert.swal("The form cannot be submitted because it contains validation errors!", data.message + errors, "error");
												});
                } else {
	                userFactory.post($scope.formData)
						.success(function(userid){
							$state.go('app.wall' , { userid: userid } );
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

		if ($stateParams.userid) {
			$scope.newUser = false;
			$scope.action = "Edit";
			console.log("Load User: " + $stateParams.userid);
			getUser($stateParams.userid);
		} else {
			if (!$stateParams.credentialid){
				SweetAlert.swal('System error: missing credential information.');
			}
			$scope.formData.credential = $stateParams.credentialid;
			getUserCredential($stateParams.credentialid);
			$scope.action = "Create";
		}
	    $scope.noImage = false;
	}

	function getUserCredential(credentialid){
		userFactory.getUserCredential(credentialid)
					.success(function(credential){
						$scope.formData.credential = credential;
					})
					.error(function(err){
						SweetAlert.swal('Failed to load credential information', err, 'error');
					})
	}

	function getUser(id) {

		userFactory.getUser(id)
			.success(function(data){
				$scope.formData = data;
				$scope.formData.password2 = data.password;
				$scope.formData.nameDisplay = $scope.formData.credential.name.firstname + " " + $scope.formData.credential.name.lastname ;
				$scope.formData.certificationsDisplay = _.join($scope.formData.certifications, ', ');
				$scope.formData.specializationsDisplay = _.join($scope.formData.specializations, ', ');
				$scope.formData.trainingStyleDisplay = _.join($scope.formData.trainingStyle, ', ');
			})
			.error(function(err){
				console.log(err);
			});
	}
  });
