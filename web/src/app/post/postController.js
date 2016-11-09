'use strict';

var post = require('angular').module('post');
var moment = require('moment');

post.directive('post', function(){
	return {
			restict : 'EA',
			scope: {
				messages : '=',
				parentid : '=',
				type: '@'
			},
			templateUrl: 'post/post.tpl.html',
			controller: 'postController',
			controllerAs : 'vm'
	};
});


post.controller('postController', function($rootScope, $scope, postFactory, SweetAlert, alertify, appForm){



	var vm = this;
	vm.postSelected = false;

	if (!$scope.type) {
		vm.reply = false;
	} else {
		vm.reply = ($scope.type === 'reply')?true:false;
	}

	if (vm.reply){
		vm.defaultType = 'Reply';
	} else  {
		vm.defaultType = 'Message';
	}

	vm.cancel = function(){
		vm.postSelected = false;
		$scope.uploadFile = false;
		$scope.uploadImage = false;
		$scope.post.files.map(function(file){file.remove();});
		$scope.post = {
			discussion_id: $scope.parentid,
			author: {
				id: $scope.userid,
				name: $scope.username
			},
			files: [],
			likes: [],
			classes: [],
			type: vm.defaultType,
			comments: 0,
		};
	}


	var _ = require('lodash');
	var count = 1;

	$scope.obj = {};

	$scope.userid = '57610b8a3f95d8f685f197a8';
	$scope.username = 'Rambabu Ravuri';
	$scope.classid = '5783c3bba53bba2bed66e7d5';
	$scope.classname = 'Bodybuilding 101';
	$scope.isReply = ($scope.parentid?true:false);
	$scope.isTeacher = true;
	$scope.isAdmin = true;
	$scope.isStudent = false;

	$scope.post = {
		discussion_id: $scope.parentid,
		author: {
			id: $scope.userid,
			name: $scope.username
		},
		files: [],
		likes: [],
		classes: [],
		type: vm.defaultType,
		comments: 0,
	};



	init()
	function init(){

		//$scope.tag = tag();

		// $scope.selectProgram = function(program){
		// 	$scope.tag.selectProgram(program);
		// }

		$scope.uploadFile = false;
		$scope.uploadImage = false;
		$scope.showSettings = false;
		$scope.showDueBy = false;


		$scope.uploadImages = function (){
			$scope.uploadFile = false;
			$scope.uploadImage = true;
		}

		$scope.uploadFiles = function(){
			$scope.uploadFile = true;
			$scope.uploadImage = false;
		}

	

		$scope.form = appForm.AppForm(angular, function(form){

			//$scope.post.type = $scope.tag.getSelectedType();
			//$scope.post.classes = $scope.tag.getSelectedClasses();
			//$scope.post.dueby = $scope.tag.dueby.value;

			postFactory.createPost($scope.post)
						.success(function(data){

						alertify
						    .success("Post is created successfully");

						    $scope.uploadFile = false;
							$scope.uploadImage = false;
							// $scope.showSettings = false;
							// $scope.showDueBy = false;

					        $rootScope.$emit('POST_CREATED');

							$scope.post = {
											discussion_id: $scope.parentid,
											author: {
												id: $scope.userid,
												name: $scope.username
											},
											class: {
												id: $scope.classid,
												name: $scope.classname
											},
											files: [],
											likes: [],
											comments: 0,
											type: vm.defaultType
										};
						})
						.error(function(err){
							console.log(err);
						});
		} );

	} //END INIT
		var _ = require('lodash');

	function tag() {

		var programs = [ { name: 'program 1', checked: true , disabled: false} , { name:'program 2', checked : false, disabled: false} ];
		var classes = [ { name: 'class 102', program:'program 1', checked: false , disabled: false, show: true}, { name: 'class 103', program:'program 2', checked: false , disabled: false, show: true}, { name: 'class 104', program:'program 1', checked: false , disabled: false, show: true}, { name: 'class 105', program:'program 2', checked: false , disabled: false, show: true}];
		var types = [{ name: 'comment', checked: false }, { name: 'notification', checked: false }, { name: 'assignment', checked: false }, { name: 'newsletter', checked: false }];
		var dueby = { value: '12/31/2016'};

		var selectedPrograms = ['Program 1'];
		var selectedClasses = ['class 101'];
		var selectedType = 'comment';
		var allPrograms = { checked: false } ;
		var allClasses = { checked : false } ;

		var tags = [];

		init();

		function init(){

			_.forEach(programs, function(program){
				if (_.indexOf(selectedPrograms, program.name) >= 0) {
					program.checked = true;
				}
			});
			_.forEach(classes, function(clazz){
				if (_.indexOf(selectedClasses, clazz.name) >= 0) {
					clazz.checked = true;
				}
			});
			_.forEach(types, function(type){
				if (type.name === selectedType) {
					type.checked = true;
				}
			});

			updateTags();
		}

		function updateTags() {

			console.log('update tags');

			tags = [];

			 selectedPrograms = _.map( _.filter(programs, {checked:true}), function(o) { return o.name.toLowerCase() } );
			_.forEach(selectedPrograms, function(clazz) {tags.push({name:'program', value: clazz})});

		    selectedClasses = _.map( _.filter(classes, {checked:true}), function(o) { return o.name.toLowerCase() } );
			_.forEach(selectedClasses, function(clazz) {tags.push({name:'class', value: clazz})});

			if (allPrograms.checked){
				tags.push({name:'program', value: 'all programs'});
			}

			if (allClasses.checked){
				tags.push({name:'class', value: 'all classes'});
			}
			selectedType = (_.filter(types, {checked:true}))[0].name;
			tags.push({name:'type', value:selectedType});
			if (dueby.value && dueby.value!= null) {
				tags.push({name:'dueby', value:'Due by:' + dueby.value});
			}

		}


		var selectType = function (postType) {
			_.forEach(types, function(t) {
				if (t.name === postType) {
					t.checked = true;
				} else {
					t.checked = false;
				}
			});
			selectedType = postType;
			if (selectedType !='assignment' && dueby && dueby !== null) {
				dueby.value = null;
			}
			updateTags();
		}

		var getCrumbs = function(){
			return tags;
		}

		var removeCrumb = function(name, value) {
			console.log('Remove crumb: ' + name + ', ' + value);

			switch (name) {
				case 'program':
							_.forEach(programs, function(t) {
									if (t.name === value) {
										t.checked = false;
									}
								});
							updateTags();
							break;

				case 'class':
							_.forEach(classes, function(t) {
									if (t.name === value) {
										t.checked = false;
									}
								});
							updateTags();
							break;
				case 'type':
							selectType('comment');
							break;
			}
		}

		var selectAllPrograms = function(){
			if (allPrograms.checked) {
				_.forEach(programs, function(t) {
								t.checked = false;
								t.disabled = true;
						});
				allClasses.checked = true;
				selectAllClasses();
			} else {
				_.forEach(programs, function(t) {
								t.disabled = false;
						});
				allClasses.checked = false;
				selectAllClasses();
			}

			updateTags();
		}

		var selectAllClasses = function(){
			if (allClasses.checked) {
				_.forEach(classes, function(t) {
								t.checked = false;
								t.disabled = true;
						});
			}else {
				_.forEach(classes, function(t) {
								t.disabled = false;
						});
			}
			updateTags();
		}

		var selectProgram = function(program){
			console.log(program);
			if (program) {
				_.forEach(classes, function(clazz){
					if (clazz.program === program) {
						clazz.show = true
					} else {
						clazz.show = false;
					}
				});
			} else {
				_.forEach(classes, function(clazz){
						clazz.show = true
				});
			}
		}

		var isNotification = function(){
			return selectType === 'assignment';
		}

		var getSelectedClasses = function(){
			if (allClasses.checked) {
				return _.map(classes, function(c) {return c.name;})
			}
			return _.map(_.filter(classes, function(c) {return c.checked;}), function(c) {return c.name;})
		}

		return {

			programs: programs,
			classes: classes,
			types: types,
			allPrograms: allPrograms,
			allClasses: allClasses,
			dueby: dueby,
			update: updateTags,
			selectType: selectType,
			crumbs: getCrumbs,
			removeCrumb: removeCrumb,
			getSelectedType: function(){return selectedType;},
			getSelectedClasses: getSelectedClasses,
			selectAllPrograms: selectAllPrograms,
			selectAllClasses: selectAllClasses,
			selectProgram: selectProgram,
			isNotification: isNotification
		};

	}



});
