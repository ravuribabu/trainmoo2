var comment = require('angular').module('comment');

comment.directive('submitActions', function(){
	return {
			restict : 'EA',
			scope: {
				msg : '=',
				showReplies: '&',
				showPost: '&'
			},
			templateUrl: 'comment/submitActions.tpl.html',
			controller: 'submitActionController',
			controllerAs: 'vm'
	};
});


comment.controller('submitActionController', function($scope, $uibModal, postFactory, $stateParams){

	let vm = this;

	vm.showReplyType = 'submission';

	$scope.$watch('msg', function(msg) {
		init(msg.replies);
	})

	vm.showPost =  (type) => {
		vm.showReplyType = type;
		$scope.showPost({type :type} );
		$scope.showReplies({type :type});
	}

	vm.showReplies = (type) => {
		vm.showReplyType = type;
		//$scope.showPost({type :type});
		$scope.showReplies({type :type});
	}

	function init(replies){
		vm.submissionsCount = replies.filter((r)=>  { return r.responseType === 'submission' } ).length;
		vm.qaCount = replies.filter((r)=> { return r.responseType === 'reply' }).length;
		vm.remainingCount = 10;

		//$scope.showPost({ type: vm.showReplyType } );
		$scope.showReplies( { type: vm.showReplyType });
	};

});	