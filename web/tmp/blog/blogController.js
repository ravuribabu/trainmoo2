'use strict';

var angular = require('angular');
var blog = angular.module('blog');
var moment = require('moment')
var utils = require('utils')

blog.config(['flowFactoryProvider', function (flowFactoryProvider) {
	  flowFactoryProvider.defaults = {
	    target: 'api/img/upload/',
	    permanentErrors: [404, 500, 501],
	    maxChunkRetries: 1,
	    chunkRetryInterval: 5000,
	    simultaneousUploads: 4,
	    uploadMethod: 'POST'
	  };
	}]);

blog.controller('blogReadController',
	function($scope, $rootScope, $stateParams, SweetAlert, $uibModal, postFactory){
		console.log($stateParams.postid);
		postFactory.getPost($stateParams.postid).success(function(data){$scope.msg = data;}).error(function(err){console.log(err);});

	});

blog.controller('blogController',
	function($scope, $rootScope, $stateParams, SweetAlert, $uibModal, postFactory){

		init();
		function init() {

		$scope.userid = '57610b8a3f95d8f685f197a8';
		$scope.username = 'Rambabu Ravuri';
		$scope.classid = '5783c3bba53bba2bed66e7d5';
		$scope.classname = 'Bodybuilding 101';

		$scope.post = {
			author: {
				id: $scope.userid,
				name: $scope.username
			},
			class: {
				id: $scope.classid,
				name: $scope.classname
			},
			pictureids: [],
			likes: [],
			comments: 0,
		};


		$scope.form = new utils.AppForm(angular, function(form){

			$scope.post.type = 'blog';

			postFactory.createPost($scope.post)
						.success(function(data){

							SweetAlert.swal({
					            title: "Blog Created!",
					            text: "Congratulations, your blog is published successfully!",
					            type: "success",
					            confirmButtonColor: "#007AFF"
					        });

							$scope.post =  {
												author: {
													id: $scope.userid,
													name: $scope.username
												},
												class: {
													id: $scope.classid,
													name: $scope.classname
												},
												pictureids: [],
												likes: [],
												comments: 0,
											};
						})
						.error(function(err){
							console.log(err);
						});
		} );



		 // Editor options.
		    $scope.options = {
		        language: 'en',
		        allowedContent: true,
		        entities: false,
		        toolbar: [
		        			{ name: 'styles', items : [ 'Format'] },
		        			{ name: 'basicstyles', items : [ 'Bold','Italic'] },
							{ name: 'paragraph', items : [ 'NumberedList','BulletedList','JustifyLeft','JustifyCenter','Blockquote'] },
							{ name: 'links', items : [ 'Link'] },
							{ name: 'insert', items : [ 'uploadimage100', 'Youtube','Table','HorizontalRule', '-', 'Source'] }	],
				extraPlugins: 'divarea,youtube,uploadimage100,dragresize,justify',
				youtube_width : '640',
				youtube_height : '480',
				skin: 'moono',
				height: 500,
		    };

		    if (!CKEDITOR.plugins.get('uploadimage100')) {
			    CKEDITOR.plugins.add( 'uploadimage100', {
				    icons: 'uploadimage100',
				    init: function( editor ) {
				        console.log('Upload Image 100');
				        editor.addCommand('uploadimage100', { exec: function (editor) {

																		    var modalInstance = $uibModal.open({

																				      animation: $scope.animationsEnabled,
																				      templateUrl: 'uploadImage.html',
																				      controller: function($scope, $uibModalInstance, $location){

																				      	$scope.title = 'Choose file to upload';
																				      	$scope.obj = {};

																				      	var path = $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port;

																				      	$scope.fileSuccess = function($file, $message, $flow ) {

																				      			modalInstance.close();

																					      		var img = editor.document.createElement( 'img' );
																								img.setAttribute( 'src', path + '/api/img/download/' + $file.uniqueIdentifier );
																								img.setAttribute('class', 'img-responsive');
																								editor.insertElement(img );

																								$flow.cancel();

																								SweetAlert.swal({
																						            title: "Blog Created!",
																						            text: "Congratulations, your blog is published successfully!",
																						            type: "success",
																						            confirmButtonColor: "#007AFF"
																						        });
																							}

																						$scope.fileError = function($file, $message, $flow ) {
																							SweetAlert.swal($message);
																						}


																				      	$scope.ok = function() {
																				      		if ($scope.obj.flow && $scope.obj.flow.files.length > 0) {
																										$scope.obj.flow.upload();
																									}
																				      	}

																				      	$scope.cancel = function(){modalInstance.dismiss();}

																				      },
																				      size: 'md',
																				      resolve: {

																				      }
																				    });

																		    modalInstance.result.then(function () {
																		     	 console.log('Modal oked at: ' + new Date());
																		    }, function () {
																		      console.log('Modal dismissed at: ' + new Date());
																		    });
																		  }
									});
				        editor.ui.addButton( 'uploadimage100', {
						    label: 'Upload Image',
						    command: 'uploadimage100',
						    toolbar: 'insert'
						});
				    }
				});

			}

		    // Called when the editor is completely ready.
		    $scope.onReady = function () {
		        // ...
		    };
		}


	});
