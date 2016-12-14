'use strict';

window.PhotoSwipe = require('../../../node_modules/photoswipe/dist/photoswipe');
window.PhotoSwipeUI_Default = require('../../../node_modules/photoswipe/dist/photoswipe-ui-default');
require('ng-photoswipe');
// require('../../../node_modules/pdfjs-dist/build/pdf.combined');
// require('./ng-pdf');

var gallery = require('angular').module('gallery', ['ngPhotoswipe']);

gallery.config(function (flowFactoryProvider) {

		flowFactoryProvider.defaults = {
		    target: 'api/img/upload/',
		    permanentErrors: [404, 500, 501],
		    maxChunkRetries: 2,
		    chunkRetryInterval: 5000,
		    simultaneousUploads: 1,
		    uploadMethod: 'POST'
		  };
		  
          flowFactoryProvider.factory = function (opts) {
            var Flow = require('../../../node_modules/ng-flow/dist/ng-flow-standalone');
            return new Flow(opts)
         }
       });

gallery.directive('gallery', function(){

	return {	
		require: ['gallery','?form'],
		restrict: 'A',
		scope: {
			files: '=',
			type: '@',
			galleryTitle: '@',
			single: '@',
			size: '@',
			readonly: '@'
		},
		templateUrl: 'shared/gallery.tpl.html',
		controller: 'galleryController',
		controllerAs: 'vm',
		link: function(scope, elms, attrs, controllers) {
			var galleryController = controllers[0];
			var formController = controllers[1];
			galleryController.setFormController(formController);
		}
	};

});


gallery.controller('galleryController', ['$scope', '$state', '$http', '$rootScope', function($scope, $state, $http, $rootScope){
	
	var _ = require('lodash' );	
	var vm = this;
	vm.gallery = {};
	vm.pageswipe = {open: false};


	function getFiletype(files) {
		if (files && files.length > 0) {

		  var file = files[0];
		  if (file.type.indexOf('pdf') >= 0)  {
		  	return 'pdf';
		  }	
		  if (file.type.indexOf('image') >= 0)  {
		  	return 'image';
		  }	

		}
	}
	init();

	function init(){

		if (!$scope.readonly) {
			vm.readonly = false;
		} else {
			vm.readonly = $scope.readonly === 'true'?true:false;
		}
		
		if (!$scope.size) {
			$scope.size = 'lg';
		}

		if (!$scope.single) {
			$scope.single = 'false';
		}

		if (!$scope.type && $scope.files && $scope.files.length > 0) {
			$scope.type = getFiletype($scope.files)
		}

		if ($scope.type === 'image') {
			$scope.$watch('files', function(files, oldfiles){
				if (files && files.length > 0) {
					prepareSlidesForPageswipe(files);
				}
				if (oldfiles && oldfiles.length > 0 && (!files || files.length <= 0)) {
					console.log('DELETE FILES');
				}
			});
		}

		// $rootScope.$on('RESET', function(event){
		// 	console.log('Reset $FLOW' + JSON.stringify($scope.files));
		// 	if ($scope.files){
		// 		$scope.files.map(function(file){
		// 			vm.deleteAttachment($scope.files, file);
		// 		});
		// 	}
		// });
	}


	//CODE FOR IMAGES
	vm.opts = {
		index: 0
	};

	vm.setFormController = function(formController){
		vm.formController = formController;
	}

	function prepareSlidesForPageswipe(files) {

		console.log('slides refreshed');

		vm.slides = files.map(function(elm){
		      return {
		          src: 'api/img/download/' + elm.fileid,
		          h: elm.dimensions.height, 
		          w: elm.dimensions.width,
		          title: elm.caption,
		      };
		    });

	}


	vm.showGallery = function (i, picture) {
		if ($scope.type === 'image'){
			if(angular.isDefined(i)) {
			  vm.opts.index = i;
			}
			vm.open = true;
		} else if ($scope.type === 'pdf') {
			$state.go('app.appt.pdf' , {fileid: picture.fileid, caption: (picture.caption?picture.caption:picture.fileName)});
		}
	};

	vm.closeGallery = function () {
		vm.open = false;
	};


	//COMMON FLOWJS CODE
	vm.fileSuccess = function( $file, $message, $flow ) {

	}

	vm.onFileAdded = function (file) {

	  if ($scope.type === 'pdf' && file.getExtension() === 'pdf') {
	  	return true;
	  }	

	  if ($scope.type === 'image' && ['jpg', 'png', 'jpeg', 'gif'].indexOf(file.getExtension()) < 0)  {
	  	return false;
	  }	

	  if (file.file.dimensions) {
	    file.dimensions = file.file.dimensions;
	    if (file.dimensions.width < 100) {//dimensions validator
	      alert('invalid dimensions');
	      return false;
	    }
	    return true;// image is valid
	  }
	  var fileReader = new FileReader();
	  fileReader.readAsDataURL(file.file);
	  fileReader.onload = function (event) {
	    var img = new Image();
	    img.onload = function() {
	      console.log(this.width + 'x' + this.height);
	      file.file.dimensions = {
	        width: this.width,
	        height: this.height
	      };
	      file.flowObj.addFile(file.file);
	    }
	    img.src = event.target.result
	  };
	  return false;// do not add file to be uploaded
	//// or $event.preventDefault(); depends how you use this function, in scope events or in directive
	}



	vm.openGallery = function(){
		vm.pageswipe = {open:true};
	}

	vm.deleteAttachment = function (attachments, picture) {
		$http.delete('api/img/' + picture.fileid)
			 .success(function(msg){
			 	console.log('Nice. Deleted forever ' + picture.fileid);
			 })
			 .error(function(err){
			 	console.log('Crap. Could not delete ' + picture.fileid);
			 });

		$http.delete('api/img/' + picture.thumbnailid)
			 .success(function(msg){
			 	console.log('Nice. Deleted forever ' + picture.thumbnailid);
			 })
			 .error(function(err){
			 	console.log('Crap. Could not delete ' + picture.thumbnailid);
			 });

		_.remove(attachments, function(a) { return a._id === picture._id ; });
		if (vm.formController){
			vm.formController.$setDirty(true);
		}

		console.log($scope.files);
	}

	vm.flowComplete = function( $flow , flowName) {

		if ($flow.files.length <= 0) {
			return;
		}

		if (!$scope.files) {
		  $scope.files = [];
		}

		$scope.files = $scope.files.concat($flow.files.map(function(fileImg){
		    return {
		      fileid : fileImg.uniqueIdentifier,
		      fileName: fileImg.name,
		      size: fileImg.size,
		      type: fileImg.file.type,
		      caption: fileImg.caption,
		      //schoolid: $scope.school._id,
		      thumbnailid: fileImg.uniqueIdentifier + getThumbnailExtension(fileImg.file.type),
		      dimensions: fileImg.dimensions,
		      remove: function(){
		      	vm.deleteAttachment($scope.files, this);
		      }
		    };
		  }));

		$scope.$apply();
		console.log('Flow completed: ' + JSON.stringify($scope.files));

		if (vm.formController){
			vm.formController.$setDirty(true);
		}
		
		$flow.cancel();

	}

	function getThumbnailExtension(filetype) {

		if (filetype === 'image/jpeg') {
		  return '_thumb.jpg';
		}

		if (filetype === 'image/png') {
		  return '_thumb.png';
		}


		if (filetype === 'application/pdf') {
		  return '-0.png';
		}

	}


	vm.uploadAttachment = function($file, $message, $flow) {
		$flow.upload();
	}

}])