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

comment.controller('commentController', function($scope, $uibModal, postFactory, $stateParams, $aside){
	
	var vm = this;
	var _ = require('lodash');

	init()
	function init(){

		vm.name = _.capitalize($scope.msg.author.name.firstname) + ' ' + _.capitalize($scope.msg.author.name.lastname);
		vm.classnames = $scope.msg.classes.map(function(c) { return _.capitalize(c.name) ;} );
		vm.posted = moment($scope.msg.created_at).fromNow();

		vm.isreply = $scope.msg.parent?true:false;
		vm.hasReplies = $scope.msg.replies && $scope.msg.replies.length > 0;
		vm.showSubmitActions = $scope.msg.submittable && $scope.msg.type != 'Task' && !vm.isreply;
		vm.showTaskActions = $scope.msg.submittable && $scope.msg.type == 'Task' && !vm.isreply;
		vm.hasRichtext = ($scope.msg.richtext?true:false);
				
		$scope.showPost = (type) => { 
			vm.postType = type;
			console.log('showPost:' + type);
		}

		$scope.delete = () => {
			if ($scope.msg._id) {
				postFactory.deletePost($scope.msg._id);
			}
		}

		$scope.showReplies = (type) => {
			if (!type) {
				type = 'reply';
			}
			vm.repliesType = type;
			vm.selectedReplies = ($scope.msg.replies.filter((r) => { return r.responseType === type}));
			console.log('show replies' + type);
		}
		vm.repliesType = 'reply';
		$scope.showReplies('reply');

		if ($scope.msg.dueby) {
			const current = moment(new Date());
			const due = moment($scope.msg.dueby);
			vm.duein = current.to(due);
		}

		if (!vm.isReply){
			vm.replies = $scope.msg.replies;
			//initializeReplies($scope.replies);
		}


		//loadReplies();
	}	

	

	function loadReplies() {
		if (!vm.isReply){
				postFactory.getReplies($scope.msg._id)
							.success(function(data){
								vm.replies = data;
								const msg = $scope.msg;
								msg.replies = data;

								$scope.msg = {};
								Object.assign($scope.msg, msg);
								$scope.showReplies(vm.postType);
								//initializeReplies($scope.replies);
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
		if ($scope.msg._id === parent) {
			event.stopPropagation();
			loadReplies();
		}
	});

	vm.openRichtext = () => {
		const richtextid = $scope.msg.richtext.id
		var modalInstance = $aside.open({
		            templateUrl: 'richtext/richtext.tpl.html',
		            size: 'lg',
		            backdrop: true,
		            controller: 'richtextController',
		            placement: 'right',
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

