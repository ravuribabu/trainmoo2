'use strict';

var school = require('angular').module('school');

school.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider.
    	state('app.appt.school', {
            url: "/school",
            templateUrl: "school/school.tpl.html",
            controller: 'schoolController'
        }).
        state('app.appt.schoolEdit', {
            url: "/schoolEdit",
            templateUrl: "school/schoolEdit.tpl.html",
        }).state('app.appt.pdf', {
            url: "/pdfview/:fileid/:caption",
            templateUrl: "school/pdfview.tpl.html",
            controller: function($scope, $stateParams, $location){
                $scope.title = $stateParams.caption;
                var path = $location.$$protocol + "://" + $location.$$host + ":" + $location.$$port;
                $scope.pdfUrl = path + '/api/img/download/thumbnail/' + $stateParams.fileid ;
            },
            controllerAs: 'vm'
        }).state('app.appt.program', {
            url: "/school/:schoolid/program/:classid",
            templateUrl: "school/class/classEdit.tpl.html",
        }).state('app.appt.class', {
            url: "school/:schoolid/class/:classid",
            templateUrl: "school/class/classEdit.tpl.html",
        }).state('app.appt.schoolusers', {
                url: "/school/:schoolid/users",
                templateUrl: "school/users/classUsers.tpl.html",
                controller: "schoolUsersController",
                controllerAs: "vm"
        }).state('app.appt.classusers', {
            url: "/school/:schoolid/class/:classid/users",
            templateUrl: "school/users/classUsers.tpl.html",
            controller: "classUsersController",
            controllerAs: "vm"
        });


	$locationProvider.html5Mode(true);
});

