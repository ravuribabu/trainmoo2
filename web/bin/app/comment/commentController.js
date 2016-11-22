/*encapsulates comment on wall*/

var moment = require('moment');

var comment = require('angular').module('comment');

comment.directive('comment', function(){
	return {
			restict : 'EA',
			scope: {
				msg : '='
			},
			templateUrl: 'comment/comment.tpl.html',
			controller: 'commentController',
			controllerAs: 'vm'
	};
});

comment.controller('commentController', function($scope, $uibModal, postFactory, $stateParams){
	
	var vm = this;
	var _ = require('lodash');

	init()
	function init(){

		vm.name = _.capitalize($scope.msg.author.name.firstname) + ' ' + _.capitalize($scope.msg.author.name.lastname);
		vm.classnames = $scope.msg.classes.map(function(c) { return _.capitalize(c.name) ;} );
		vm.posted = moment($scope.msg.created_at).fromNow();

		vm.isreply = $scope.msg.parent?true:false;
		vm.hasReplies = $scope.msg.replies && $scope.msg.replies.length > 0;
		vm.showSubmitActions = $scope.msg.submittable && !vm.isreply
		vm.hasRichtext = ($scope.msg.richtext?true:false);
		
		vm.showReplyBox = false;
		vm.showSubmitBox = false;
		vm.showReply = () => { vm.showReplyBox = !vm.showReplyBox ; vm.showSubmitBox = false; vm.showAllReplies('reply');}
		vm.showSubmission = () => { vm.showSubmitBox = !vm.showSubmitBox ; vm.showReplyBox = false; vm.showAllReplies('submission');}

		if ($scope.msg.dueby) {
			const current = moment(new Date());
			const due = moment($scope.msg.dueby);
			vm.duein = current.to(due);
		}

		if (!vm.isReply){
			$scope.replies = $scope.msg.replies;
			initializeReplies($scope.replies);
		}
		//loadReplies();
	}	

	vm.showFewReplies = true;
	vm.showAllReplies = function (type) {
		if (!type) { type = 'reply'}
		vm.showFewReplies = false;
		vm.visibleReplies = $scope.replies.filter((r) => { return r.responseType === type });
		vm.visibleReplyType = type;
	}

	//Show only latest 2 replies - latest at the bottom
	function initializeReplies(replies) {
		if (replies && replies.length > 2) {
			vm.visibleReplies = vm.showFewReplies? replies.slice(-2) : replies;
		}	

		if (replies && replies.length<= 2) {
			vm.showFewReplies = false;
			vm.visibleReplies = replies;
		}

		if (vm.showSubmitActions) {
			vm.submissionsCount = replies.filter((r)=>  { return r.responseType === 'submission' } ).length;
			vm.qaCount = replies.filter((r)=> { return r.responseType === 'reply' }).length;
			vm.totalStudentsCount = 20;
			vm.remainingCount = 10;
			//vm.showAllReplies('submission');
		} 
	}


	function loadReplies() {
		if (!vm.isReply){
				postFactory.getReplies($scope.msg._id)
							.success(function(data){
								$scope.replies = data;
								initializeReplies($scope.replies);
							})
							.error(function(err){
								console.log(err);
							});
			}
	};

	

	$scope.getFirstImageSrc = function(html){
		var div = document.createElement('div');
		div.innerHTML = html;
		var firstImage = div.getElementsByTagName('img')[0]
		var imgSrc = firstImage ? firstImage.src : "";
		return imgSrc;
	}

	$scope.$on('POST_CREATED', function(event, parent){
		if ($scope.msg._id === parent._id) {
			event.stopPropagation();
			loadReplies();
		}
	});

	vm.openRichtext = () => {
		const richtextid = $scope.msg.richtext.id
		var modalInstance = $uibModal.open({
		            templateUrl: 'richtext/richtext.tpl.html',
		            size: 'lg',
		            backdrop: true,
		            controller: 'richtextController',
		            resolve:  {
		            	params: function() {
			            		return {
				            		'richtextid': richtextid,
				            		'readonly': true
		            			};
		            	}
		            }
		        });

		modalInstance.result.then(function () {
	    }, function () {
	      console.log('Modal dismissed at: ' + new Date());
	    });
	}

});

