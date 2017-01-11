const assessment = angular.module('assessment');


assessment.directive('assessmentMultipleChoice', function(){
	return {
			restict : 'EA',
			scope: {
				assessment: "=",
				remove: "&",
				moveup: "&",
				movedown: "&"
			},
			templateUrl: 'assessment/assessmentMC.tpl.html',
			controller: 'assessmentMCController',
			controllerAs: 'vm'
	};
});


assessment.controller('assessmentMCController', function($scope, assessmentFactory, appForm) {

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

			if (vm.assessment.options.length < 2) {
				vm.errorMessage = 'Should enter atleast two valid choices..';
				return;
			}

			const answers = vm.assessment.options.filter((o) => { return o.answer === true});
			if (answers.length <= 0) {
				vm.errorMessage = "Atleast one option should be selected as answer";
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
	      }, function(){

	      });


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
			let maxSeqNo = 'A';
			if (vm.assessment.options.length > 0) {
			 var chars = vm.assessment.options.map(function(o){return o.seqno.charCodeAt(0);});
			 maxSeqNo = Math.max.apply(Math, chars);
			 maxSeqNo = String.fromCharCode(maxSeqNo + 1)
			}
			vm.assessment.options.push({ text : "" , seqno: maxSeqNo, answer: false});
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