
var angular = require('angular')
var school = angular.module('school')
var _ = require('lodash');

school.controller('schoolController',
	["$scope", "$rootScope", "schoolFactory", "SweetAlert", "$window", "$state", "$stateParams" , "$uibModal",
		function($scope, $rootScope, schoolFactory, SweetAlert, $window, $state, $stateParams, $uibModal){

	init();

	function init(){

		schoolFactory.getSchools()
                           .success(function(schools){
                              //TODO let user select school 
                              if (schools) {                              
                                var school = schools[0];
                                $scope.school = school;
                                $scope.schoolid = school._id;
                              } else {
                              	$scope.schoolid = '';
                              }
                           })
                           .error(function(err){
                             console.log(err);
                           });


		$scope.classes = [];

		$scope.$watch('schoolid' , function(schoolid){
			
			if (!schoolid) {
				return;
			}
			
			schoolFactory.getProgramsclasses(schoolid)
			 .success(function(data) {
	 				console.log('receieved class data' + data);
					var programsclasses = data;
					_.forEach(programsclasses, function(clazz, index) {

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


					var programs = programsclasses
									.filter((claz) => {
										return !claz.program;
									})
									.map((claz) => {
										claz.classes = [];
										return claz;
									});

					var programPositions = {};
					programs.forEach((p, index) => {
							programPositions[p.name] = index;
					});

					var classes = programsclasses
									.filter((claz) => {
										return claz.program;
									}).forEach((claz) => {
										const programPosition = programPositions[claz.program.name];
										const program = programs[programPosition];
										program.classes.push(claz);
									});
					var visibleClasses = [];
					programs.forEach((p) => {
						visibleClasses.push(p);
						p.classes.forEach((claz) => {
							visibleClasses.push(claz);
						});
					})


					$scope.classes = visibleClasses;

				})
			 .error(function(data){
					var errors = "\n";

					_.forEach(data.errors, function(element, index) {
						errors = errors + "\n" + index + ": " + element.message
					});

					SweetAlert.swal("Failed to create class!", data.message + errors, "error");
			});	

		});

	}


}]);



