
var angular = require('angular')
var classModule = angular.module('class')
var utils = require('utils') //../../core/utils

classModule.controller('classController',
	["$scope", "$rootScope", "classFactory", "SweetAlert", "$window", "$state", "$stateParams", "alertify" ,
		function($scope, $rootScope, classFactory, SweetAlert, $window, $state, $stateParams, alertify){

	$scope.disableForm = true;
	$scope.classid = $stateParams.classid;
	$scope.programid = $stateParams.programid;
	$scope.classType = $stateParams.type;

	if ($scope.programid || $scope.classType === 'Class') {
		$scope.title = 'Class';
		$scope.type = 'Class';
	} else {
		$scope.title = 'Program';
		$scope.type = 'Program';
	}


	$scope.teachers = [{
			id: $scope.userid,
			name: 'Rambabu Ravuri'
		}]

	$scope.disableForm = false;
	$scope.formData = {
		programid: $scope.programid
	} ;


	if ($scope.classid) {
		classFactory
				.getClass($scope.classid)
				.success(function(data) {
				 				console.log('receieved class data' + data);
								$scope.formData = data;
								$scope.formData.start = new Date($scope.formData.start);
								$scope.formData.end = new Date($scope.formData.end);
							})
						 .error(function(data){
								var errors = "\n";

								_.forEach(data.errors, function(element, index) {
									errors = errors + "\n" + index + ": " + element.message
								});

								SweetAlert.swal("The form cannot be submitted because it contains validation errors!", data.message + errors, "error");

						});
	} else {
		formData  = {"classid": 1, "title": 'New ' + ($scope.programid?'Class':'Program')};

	}

	$scope.disableForm = false;


	$scope.form = new utils.AppForm(angular, function(form){
		if ($scope.formData._id) {
					classFactory.updateClass($scope.formData)
												.success(function(data){
													alertify
													    .reset()
													    .maxLogItems(2)
													    .closeLogOnClick(true)
													    .delay(2000)
													    .logPosition("bottom left")
													    .success("Class updated successfully");
													$state.go('app.classes');

												})
												.error(function(data){
													console.log('app.classes');
												});
                } else {
	                classFactory.createClass($scope.formData)
	                			.success(function(){
													alertify
													    .reset()
													    .maxLogItems(2)
													    .closeLogOnClick(true)
													    .delay(2000)
													    .logPosition("bottom left")
													    .success("Class created successfully");
													$state.reload();

												})
												.error(function(data){
													console.log(data);
												});
				}
	}, function(){

	});


}]);
