
var comment = require('angular').module('comment');

comment.directive('replies', function(){
	return {
			restict : 'EA',
			scope: {
				comments : '=',
			},
			templateUrl: 'comment/replies.tpl.html',
			controller: 'repliesController',
			controllerAs: 'vm'
	};
});

comment.controller('repliesController', function($scope, $uibModal, postFactory, $stateParams){

	let vm = this;
	vm.showFew = true;
	vm.replies = [];
	$scope.$watch('comments', (replies) => {
		init(replies);
	});

	function init(replies){

		if (!replies) {
			vm.visibleReplies = [];
			return;
		}
		
		vm.replies = replies;
		vm.total = vm.replies.length;

		if (vm.replies.length <= 2) {
			vm.showFew = false;
			vm.visibleReplies = vm.replies;
		}
		else if (vm.replies.length > 2) {
			if (vm.showFew){
				vm.visibleReplies = vm.replies.slice(-2);
			} else {
				vm.visibleReplies = vm.replies;
			}
		} 
		
	};

	vm.showAll = () => {
		vm.showFew = false;
		vm.visibleReplies = vm.replies;
	}
});	