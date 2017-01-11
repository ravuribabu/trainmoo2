var moment = require('moment');

var comment = require('angular').module('comment');

comment.directive('classList', function(){
	return {
			restict : 'EA',
			scope: {
				"classes" : "="
			},
			templateUrl: 'comment/classList.tpl.html',
			controller: 'classListController',
			controllerAs: 'vm'
	};
});


comment.controller('classListController', function($scope, appForm, $aside) {

	var vm = this;
	var _ = require('lodash');

	vm.classes = $scope.classes;
	
	vm.classText = vm.classes[0].name ;
	if (vm.classes.length > 1) {
		vm.showPopup = true;
		vm.classnames = $scope.classes.map(function(c) { return _.capitalize(c.name) ;} );
	} else {
		vm.showPopup = false;
	}

});
