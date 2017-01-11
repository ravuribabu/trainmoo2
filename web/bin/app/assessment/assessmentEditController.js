const assessment = angular.module('assessment');

assessment.controller('assessmentEditController', ['$scope', '$uibModalInstance', 'assessmentFactory', 'appForm', 'params', function($scope, $uibModalInstance, assessmentFactory, appForm, params) {

	var vm = this;

	vm.post = params.post;
	vm.assessments = [];
	vm.quiz = {
		assessments: vm.assessments
	};

	if (vm.post.assessment) {
		vm.quiz.title = vm.post.assessment.title;
		vm.quiz.description = vm.post.assessment.description;
		vm.quiz.duration = vm.post.assessment.duration;
	}

	init();
	function init() {

		if (vm.post._id) {
			assessmentFactory.getAssessments(vm.post._id)
							.success(function(assessments){
								console.log('Assessments Received: ' + JSON.stringify(assessments));
								vm.assessments = assessments;
								vm.quiz.assessments = assessments;
							})
							.error(function(err){
								console.log('Error message: ' + err);
							});
		} else {
			assessmentFactory.getDraftAssessments()
						.success(function(assessments){
							console.log('Assessments Received: ' + JSON.stringify(assessments));
							vm.assessments = assessments;
							vm.quiz.assessments = assessments;
						})
						.error(function(err){
							console.log('Error message: ' + err);
						});
		}
		

		vm.form = new appForm.AppForm(angular, function(form){
	       	$uibModalInstance.close(vm.quiz);
	      }, function(){});
	}

	vm.remove = (index) => {
		vm.assessments.splice(index, 1);
		console.log('REMOVE ASSESSMENT ' + index);
	}

	vm.moveup = (index) => {
		if (index > 0) {
			const tmp = vm.assessments[index - 1];
			vm.assessments[index - 1] = vm.assessments[index];
			vm.assessments[index] = tmp;

			vm.assessments[index].seqno++;
			vm.assessments[index - 1].seqno--;
		}
		console.log('MOVEUP ASSESSMENT' + index);
	}

	vm.movedown = (index) => {
		console.log('MOVEDOWN ASSESSMENT' + index);
		if (index < vm.assessments.length - 1) {
			const tmp = vm.assessments[index + 1];
			vm.assessments[index + 1] = vm.assessments[index];
			vm.assessments[index] = tmp;

			vm.assessments[index].seqno--;
			vm.assessments[index + 1].seqno++;
		}
	}

	vm.addShortAnswer = () => {
		let seqno = getNewSeqno();

		vm.assessments.push({
			seqno: seqno,
			type: "SA",
			options: []
		});
	}

	vm.addTrueFalse = () => {
		let seqno = getNewSeqno();

		vm.assessments.push({
			seqno: seqno,
			type: "TF",
			answer: ''
		});
	}

	vm.addMultipleChoice = () => {
		let seqno = getNewSeqno();

		vm.assessments.push({
			seqno: seqno,
			type: "MC",
			answer: '',
			options:[]
		});
	}


	function getNewSeqno() {
		let seqno = 0;
		if (vm.assessments.length > 0){
			seqno = Math.max.apply(Math, vm.assessments.map(function(o){return o.seqno;}));
		}
		seqno = seqno + 1;

		return seqno;
	}

} ]);