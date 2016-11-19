'use strict';

var blog = require('angular').module('blog');

blog.controller('blogController', function($scope, $uibModalInstance, richtext){
	
	$scope.richtext = richtext; 
	$scope.onPublish = () => {
		$uibModalInstance.close('publish');
	}

	$scope.onCancel = (ret) => {
		$uibModalInstance.dismiss();
	}
	
});