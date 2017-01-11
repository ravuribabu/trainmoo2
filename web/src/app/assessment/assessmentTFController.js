const assessment = angular.module('assessment');


assessment.directive('assessmentTrueFalse', function(){
	return {
			restict : 'EA',
			scope: {
				assessment: "=",
				remove: "&",
				moveup: "&",
				movedown: "&"
			},
			templateUrl: 'assessment/assessmentTF.tpl.html',
			controller: 'assessmentTFController',
			controllerAs: 'vm'
	};
});


assessment.controller('assessmentTFController', function($scope, assessmentFactory, appForm) {

	var _ = require('lodash');

	var vm = this;
	vm.assessment = $scope.assessment;
	vm.edit = false;

	init();
	function init() {

		if (!vm.assessment.question) {
			vm.edit = true;
		}

		vm.form = new appForm.AppForm(angular, function(form){

			if (!vm.assessment.answer) {
				vm.errorMessage = "Select a valid answer";
				return;
			}
			
			vm.errorMessage = "";
	        vm.edit = false;

	        if (!vm.assessment._id) {
	        	assessmentFactory.createAssessment(vm.assessment)
	        					.success(function(assessment){
	        						vm.assessment = assessment;
	        					}).error(function(err){
	        						vm.errorMessage = err;
	        					});
	        } else {
	        	assessmentFactory.updateAssessment(vm.assessment)
	        					.success(function(assessment){
		        						vm.assessment = assessment;
		        					})
	        					.error(function(err){
		        						vm.errorMessage = err;
		        					});
	        }
	       	
	      }, function(){});

	}

	vm.startEdit = () => {
		vm.edit = true;
	}

	vm.save = () => {
		vm.edit = false;
	}

	vm.setAnswerFalse = () => {
		vm.assessment.answer = "false";
	}
	
	vm.setAnswerTrue = () => {
		vm.assessment.answer = "true";
	}

	vm.removeAssessment = () => {
		$scope.remove();
	}

	vm.moveupAssessment = () => {
		$scope.moveup();
	}

	vm.movedownAssessment = () => {
		$scope.movedown();
	}

});