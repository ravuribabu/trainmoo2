const assessment = angular.module('assessment');


assessment.directive('assessmentShortAnswer', function(){
	return {
			restict : 'EA',
			scope: {
				assessment: "=",
				remove: "&",
				moveup: "&",
				movedown: "&"
			},
			templateUrl: 'assessment/assessmentSA.tpl.html',
			controller: 'assessmentSAController',
			controllerAs: 'vm'
	};
});


assessment.controller('assessmentSAController', function($scope, assessmentFactory, appForm) {

	var _ = require('lodash');

	var vm = this;
	vm.assessment = $scope.assessment;
	vm.edit = false;
	vm.errorMessage = "";

	init();
	function init() {

		if (!vm.assessment.question) {
			vm.edit = true;
		}

		vm.form = new appForm.AppForm(angular, function(form){

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

	vm.addOption = () => {
		const emptyOptions = _.filter( vm.assessment.options, function(option) { return !option.text.trim() ; })
		if (emptyOptions.length <= 0) {
			vm.assessment.options.push({ text : ""});
		}
	}

	vm.removeOption = (index) => {
		console.log('REmove option: ' + vm.assessment.options[index]);
		vm.assessment.options.splice(index, 1);
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