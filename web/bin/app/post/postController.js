'use strict';

var post = require('angular').module('post');
var moment = require('moment');

post.directive('post', function(){
	return {
			restict : 'EA',
			scope: { //TODO pass the entire POST for simplicity
				parent : '=',
				responseType: '@',
				placeholder: '@'
			},
			templateUrl: 'post/post.tpl.html',
			controller: 'postController',
			controllerAs : 'vm'
	};
});


post.controller('postController', function($rootScope, $scope, postFactory, SweetAlert, alertify, appForm, $uibModal){

	const vm = this;

	vm.parent = $scope.parent;
	vm.isReply = $scope.parent?true:false;
	vm.responseType = $scope.responseType;
	vm.placeholder = $scope.placeholder;
	
	//Default values
	vm.selection = {
		postType: { 
			name: 'Discussion', 
			icon: 'fa-exchange' ,
		} ,
		programLabel: 'All Programs',
		classLabel: 'All Classes'
	}

	//Default post values
	const emptyPost = {
			parent: vm.parent,
			files: [],
			likes: 0,
			classes: [],
			replies: [],
			type: vm.parent && vm.parent.type?vm.parent.type:vm.selection.postType.name,
			responseType: vm.responseType,
			user: vm.parent?vm.parent.author:undefined
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


	vm.sections = [
		{
			id: 1,
			name: 'Section 1',
		},
		{
			id: 2,
			name: 'Section 2',
		},
		{
			id: 3,
			name: 'Section 3',
		},
		{
			id: 4,
			name: 'Section 4',
		},
	]

	vm.reset = (digest) => {

		vm.uploadFile = false;
		vm.uploadImage = false;
		vm.showDueBy = false;
		vm.postSelected = false;
		vm.showBlogPreview = false;

		if (vm.post) {
			vm.post.files.map(function(file){file.remove();});
		}
		vm.post = { };
		Object.assign(vm.post, emptyPost);
		$scope.$broadcast('POST_RESET');

	} //END OF reset

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

			if (!vm.isReply) {
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
			}

			if (!vm.richtext && (!vm.post.text || vm.post.text.length <= 0)) {
				return;
			}

			if (vm.post.parent) {
				vm.post.parent = vm.post.parent._id;
			}
			
			postFactory.createPost(vm.post)
						.success(function(data){

						alertify
						    .success("Post is created successfully");
					       
					        $scope.$broadcast('POST_RESET');
							$scope.$emit('POST_CREATED', vm.post.parent);

						    vm.reset();

						})
						.error(function(err){
							console.log(err);
						});
		} );

	} //END INIT


	vm.editStarted = () => {
		vm.postSelected = true;
		$scope.$apply();
	}

	

	vm.selectPostType = (postType) => {
		vm.selection.postType = postType;
		vm.post.type = postType.name;
	}

	//Side navigator selection changed
	$scope.$on('WALL_NAV_CHANGED', function(event, data) {
		//TODO if readonly or reply ignore
		if (vm.isReply) {
			return;
		}
		event.preventDefault();
		Object.assign(vm.selection, data);

		if (!vm.selection.postType) {
			vm.selection.postType = { 
				name: 'Discussion', 
				icon: 'fa-exchange' ,
				newItems: 3
			}
		}
		vm.post.type = vm.selection.postType.name;
	}); 
	//END OF $scope.$on

	vm.openRichtext = () => {
		var modalInstance = $uibModal.open({
		            templateUrl: 'richtext/richtext.tpl.html',
		            size: 'lg',
		            backdrop: true,
		            controller: 'richtextController',
		            resolve:  {
		            	params: function() {
			            		return {
				            		'richtextid': undefined,
				            		'readonly': false
		            			};
		            	}
		            }
		        });

		modalInstance.result.then(function (selectedItem) {
			postFactory.getDraft()
    				.success(function(draft) { 
    					vm.draft = draft;
    					vm.post.richtext = {};
    					vm.post.richtext.id = draft;
    					vm.post.richtext.previewText = draft.previewText;
    					vm.post.richtext.previewImg = draft.previewImg;
    					vm.post.richtext.title = draft.title;
    				} )
    				.error(function(err) { 
    					console.log(err);
    				} );
	      	vm.showBlogPreview = true;
	    }, function () {
	      console.log('Modal dismissed at: ' + new Date());
	    });
	}

	

	vm.openCalendar = () => {
		var modalInstance = $uibModal.open({
		            templateUrl: 'events/calendar.tpl.html',
		            size: 'lg',
		            backdrop: true,
		            controller: function() {} ,
		    
		        });
	}


});
