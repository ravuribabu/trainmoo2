
var moment = require('moment');

var assessment = require('angular').module('assessment');

assessment.directive('assessmentCard', function(){
	return {
			restict : 'EA',
			scope: {
				"asmtpost" : "="
			},
			templateUrl: 'assessment/assessmentCard.tpl.html',
			controller: 'assessmentCardController',
			controllerAs: 'vm'
	};
});

assessment.controller('assessmentCardController', function($scope, assessmentFactory, appForm, $aside) {

	var vm = this;
	vm.post = $scope.asmtpost;

	if (vm.post.assessment) {
		vm.assessmentCard = vm.post.assessment;
	} else {
		vm.assessmentCard = {
			count: 0,
			title: 'Quiz',
			text: '',
			tfCount: 0,
			mcCount: 0,
			saCount: 0
		}
	}

	vm.editAssessment = () => {

		var modalInstance = $aside.open({
		            templateUrl: 'assessment/assessmentEdit.tpl.html',
		            size: 'lg',
		            backdrop: true,
		            controller: 'assessmentEditController',
		            controllerAs: 'vm',
		            placement: 'right',
		            resolve:  {
		            	params: function() {
			            		return {
				            		'post': vm.post,
		            			};
		            	}
		            }
		        });

		modalInstance.result.then(function (quiz) {

			console.log(JSON.stringify(quiz));
			vm.assessmentCard.title = quiz.title;
			vm.assessmentCard.description = quiz.description;
			vm.assessmentCard.duration = quiz.duration;
			vm.assessmentCard.count = quiz.assessments.length;
			vm.assessmentCard.tf = quiz.assessments.filter((a) => {return a.type === 'TF'}).length;
			vm.assessmentCard.mc = quiz.assessments.filter((a) => {return a.type === 'MC'}).length;
			vm.assessmentCard.sa = quiz.assessments.filter((a) => {return a.type === 'SA'}).length;


			vm.post.assessment = vm.assessmentCard;
			


	    }, function () {
	      console.log('Modal dismissed at: ' + new Date());
	    });

	}

});