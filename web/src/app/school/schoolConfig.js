'use strict';

var school = require('angular').module('school');

school.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider
        .state('app.apph.apps', {
            url: '/apps',
            templateUrl: 'school/appSchool.tpl.html',
        }).
    	state('app.apph.apps.school', {
            url: "/school",
            templateUrl: "school/school.tpl.html",
            controller: 'schoolController'
        })
        .
        state('app.apph.apps.schoolEdit', {
            url: "/schoolEdit",
            templateUrl: "school/schoolEdit.tpl.html",
        })
        .state('app.apph.apps.program', {
            url: "/school/:schoolid/program/:classid",
            templateUrl: "school/class/classEdit.tpl.html",
        }).state('app.apph.apps.class', {
            url: "/school/:schoolid/class/:classid",
            templateUrl: "school/class/classEdit.tpl.html",
        }).state('app.apph.apps.schoolusers', {
                url: "/school/:schoolid/users",
                templateUrl: "school/users/classUsers.tpl.html",
                controller: "schoolUsersController",
                controllerAs: "vm"
        }).state('app.apph.apps.classusers', {
            url: "/school/:schoolid/class/:classid/users",
            templateUrl: "school/users/classUsers.tpl.html",
            controller: "classUsersController",
            controllerAs: "vm"
        });


	$locationProvider.html5Mode(true);
});

