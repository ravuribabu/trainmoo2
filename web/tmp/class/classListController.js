var angular = require('angular')
var classModule = angular.module('class')

classModule.controller('classListController', ["$scope", "$rootScope", "classFactory", "SweetAlert","$stateParams",
	function($scope, $rootScope, classFactory, SweetAlert, $stateParams){

	init();

	function init(){

		$scope.classes = [];
		$scope.userid = $stateParams.userid;
		$scope.programid = $stateParams.programid;
		$scope.isClass = false;
		if ($scope.programid) {
			$scope.title = 'Classes';
			$scope.type = 'Class';
			$scope.isClass = true;

		} else {
			$scope.title = 'Programs';
			$scope.type = 'Program';

		}

		classFactory.getClasses($scope.programid)
					 .success(function(data) {
			 				console.log('receieved class data' + data);
							$scope.classes = data;
							_.forEach($scope.classes, function(clazz, index) {

									if (clazz.address || clazz.city){
										clazz.location = (clazz.address?clazz.address:'') + ', ' + (clazz.city?clazz.city:'');
									}

									clazz.categories = _.join(clazz.categories, ', ');

									clazz.style = _.join(clazz.trainingstyle, ', ');
									clazz.classes = 5;
									clazz.students = 20;
									clazz.events = 10;
									clazz.posts = 100;
								});

						})
					 .error(function(data){
							var errors = "\n";

							_.forEach(data.errors, function(element, index) {
								errors = errors + "\n" + index + ": " + element.message
							});

							SweetAlert.swal("Failed to create class!", data.message + errors, "error");
					});

		$scope.selectClazz = function(classid) {
			$scope.selected = classid;
			var clazz = _.find($scope.classes, {classid: classid});
			$rootScope.$emit('CLAZZ_SELECT', clazz);
		}

	}

}]);
