var moment = require('moment');

var wall = require('angular').module('wall');

wall.directive('comment', function(){
	return {
			restict : 'EA',
			scope: {
				msg : '=',
			},
			templateUrl: 'wall/directive/comment.tpl.html',
			controller: 'commentController',
			controllerAs: 'vm'
	};
});

wall.controller('commentController', function($scope, $uibModal, postFactory, $stateParams){
	var vm = this;
	var _ = require('lodash');

	$scope.userid = $stateParams.userid;
	vm.showAllRepliesFlag = false;

	init()
	function init(){
		vm.name = _.capitalize($scope.msg.author.name.firstname) + ' ' + _.capitalize($scope.msg.author.name.lastname);
		vm.classnames = $scope.msg.classes.map(function(c) { return _.capitalize(c.name) ;} );
		vm.posted = moment($scope.msg.created_at).fromNow();
		vm.isreply = $scope.msg.parent?true:false;
		vm.showReplyBox = false;
		vm.hasRichtext = ($scope.msg.richtext?true:false);
		vm.showReply = () => { vm.showReplyBox = !vm.showReplyBox ;}

		if ($scope.msg.dueby) {
			const current = moment(new Date());
			const due = moment($scope.msg.dueby);
			vm.duein = current.to(due);
		}
		loadReplies();
	}	

	vm.showAllReplies = function () {
		vm.showAllRepliesFlag = true;
		$scope.visibleReplies = $scope.replies;
	}

	function setVisibleReplies(replies) {
		if (replies && replies.length > 0 && !vm.showAllRepliesFlag) {
			$scope.visibleReplies = replies.slice(-2);
		}	
	}
	function loadReplies() {
		postFactory.getReplies($scope.msg._id)
					.success(function(data){
						$scope.replies = data;
						setVisibleReplies($scope.replies);
					})
					.error(function(err){
						console.log(err);
					});
	};

	$scope.showReplies = false;

	$scope.getFirstImageSrc = function(html){
		var div = document.createElement('div');
		div.innerHTML = html;
		var firstImage = div.getElementsByTagName('img')[0]
		var imgSrc = firstImage ? firstImage.src : "";
		return imgSrc;
	}

	$scope.$on('POST_CREATED', function(event, data){
		if ($scope.msg._id === data) {
			event.stopPropagation();
			loadReplies();
		}
	});

	vm.openBlog = () => {
		var modalInstance = $uibModal.open({
		            templateUrl: 'blog/blog.tpl.html',
		            size: 'lg',
		            backdrop: true,
		            controller: 'blogController',
		            resolve: {
		            	richtext: $scope.msg.richtext
		            }
		        });

		modalInstance.result.then(function () {
	    }, function () {
	      console.log('Modal dismissed at: ' + new Date());
	    });
	}

});

