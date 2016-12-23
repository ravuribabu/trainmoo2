var comment = require('angular').module('comment');

comment.directive('taskActions', function(){
	return {
			restict : 'EA',
			scope: {
				msg : '=',
				showReplies: '&',
				showPost: '&'
			},
			templateUrl: 'comment/taskActions.tpl.html',
			controller: 'taskActionController',
			controllerAs: 'vm'
	};
});


comment.controller('taskActionController', function($scope, $rootScope, $uibModal, postFactory, $stateParams, alertify){

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

	vm.onComplete = () => {
		//TODO create post with completed state and throw create-post event to refresh comments
		const postForCompletedTask = {
			parent: $scope.msg._id,
			type: $scope.msg.type,
			responseType: 'submission',
			text: '{"entityMap":{},"blocks":[{"key":"dbf78","text":"I have completed","type":"unstyled","depth":0,"inlineStyleRanges":[],"entityRanges":[],"data":{}}]}'
		};
		postFactory.createPost(postForCompletedTask)
						.success(function(data){
						alertify
						    .success("Post is created successfully");
								$scope.$emit('POST_CREATED', $scope.msg._id);
						})
						.error(function(err){
							console.log(err);
						});
	}

	function init(replies){


		vm.submissionsCount = replies.filter((r)=>  { return r.responseType === 'submission' } ).length;
		vm.qaCount = replies.filter((r)=> { return r.responseType === 'reply' }).length;
		vm.remainingCount = 10;

		vm.userHasCompletedTask = replies.find((r) => { return r.author._id === $rootScope.user.id })?true:false;

		//$scope.showPost({ type: vm.showReplyType } );
		$scope.showReplies( { type: vm.showReplyType });
	};

});	