'use strict';

var post = require('angular').module('post');
var moment = require('moment');

post.directive('post', function(){
	return {
			restict : 'EA',
			scope: {
				parent : '=',
			},
			templateUrl: 'post/post.tpl.html',
			controller: 'postController',
			controllerAs : 'vm'
	};
});


post.controller('postController', function($rootScope, $scope, postFactory, SweetAlert, alertify, appForm){

	const vm = this;
	const _ = require('lodash');
	vm.parent = $scope.parent;
	vm.isReply = $scope.parent?true:false;

	const emptyPost = {
			parent: vm.parent,
			files: [],
			likes: 0,
			classes: [],
			replies: 0,
			type: 'Discussion'
		};


	vm.postTypes = [
		{ 
			name: 'Discussion', 
			icon: 'fa-exchange' ,
			newItems: 3
		},
		{ 
			name: 'Message', 
			icon: 'fa-envelope-o' ,
			newItems: 2
		},
		{ 
			name: 'Assignment', 
			icon: 'fa-puzzle-piece' 
		},
		{ 
			name: 'Notification', 
			icon: 'wb-bell' 
		},
		{ 
			name: 'Blog', 
			icon: 'wb-bold' ,
			newItems: 3
		},
		{ 
			name: 'Material', 
			icon: 'fa-file-o' 
		},
		{ 
			name: 'Newsletter', 
			icon: 'fa-file-text-o' 
		},
		{ 
			name: 'Task', 
			icon: 'wb-check' 
		},
		{ 
			name: 'Assessments', 
			icon: 'fa-tachometer' 
		},
		{ 
			name: 'Grades', 
			icon: 'fa-bar-chart' 
		},
		{ 
			name: 'Polls', 
			icon: 'fa-tasks' 
		}];

	vm.selection = {
		postType: { 
			name: 'Discussion', 
			icon: 'fa-exchange' ,
		} ,
		programLabel: 'All Programs',
		classLabel: 'All Classes'
	}

	vm.editStarted = () => {
		vm.postSelected = true;
		$scope.$apply();
	}

	vm.reset = (digest) => {
		vm.uploadFile = false;
		vm.uploadImage = false;
		vm.showDueBy = false;
		vm.postSelected = false;
		if (vm.post) {
			vm.post.files.map(function(file){file.remove();});
		}
		vm.post = { };
		Object.assign(vm.post, emptyPost);
		$scope.$broadcast('POST_RESET');
	} //END OF reset

	vm.selectPostType = (postType) => {
		vm.selection.postType = postType;
		vm.post.type = postType.name;
	}




	init();

	function init(){

		vm.reset();
		vm.uploadImages = function (){
			vm.uploadFile = false;
			vm.uploadImage = !vm.uploadImage;
		}

		vm.uploadFiles = function(){
			vm.uploadFile = !vm.uploadFile;
			vm.uploadImage = false;
		}

		vm.form = appForm.AppForm(angular, function(form){

			if (vm.selection.class) {
				//post to class
				vm.post.classes = [{ id: vm.selection.class.id, name: vm.selection.class.name }];
			} else if (vm.selection.program) {
				//post to program
				vm.post.classes = [{ id: vm.selection.program.id, name: vm.selection.program.name } ];
			} else {
				//Post to all programs
				vm.post.classes = vm.selection.programs.map(function(p) {return { id: p.id, name: p.name };});
			}


			console.log('POST CREATE: ' + JSON.stringify(vm.post));

			if (!vm.post.text || vm.post.text.length <= 0) {
				console.log("Empty text.. Ignore request to post");
				return;
			}
			postFactory.createPost(vm.post)
						.success(function(data){

						alertify
						    .success("Post is created successfully");
					        $scope.$broadcast('POST_RESET');

						    vm.reset();

						})
						.error(function(err){
							console.log(err);
						});
		} );

	} //END INIT

	
	$scope.$on('WALL_NAV_CHANGED', function(event, data) {
		//TODO if readonly or reply ignore
		event.preventDefault();
		vm.selection = data;

		if (!vm.selection.postType) {
			vm.selection.postType = { 
				name: 'Discussion', 
				icon: 'fa-exchange' ,
				newItems: 3
			}
		}
		
		console.log('Post create selection: ' + JSON.stringify(vm.selection));
	}); //END OF $scope.$on

});
