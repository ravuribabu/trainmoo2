'use strict';

var angular = require('angular')
var classModule = angular.module('class')

classModule.config(
	function($stateProvider, $urlRouterProvider, $locationProvider) {

		$stateProvider.state('app.classes', {
		        url: "/classes?programid",
		        templateUrl: "assets/js/class/classes.html",
		        controller: "classListController"
		    }).state('app.class', {
		        url: "/class/:classid?type&programid",
		        templateUrl: "assets/js/class/details/class.html",
		        controller: "classController"
		    }).state('app.classevents', {
		        url: "/class/:classid/events",
		        templateUrl: "assets/js/class/events/events.html",
		        controller: "eventsController"
		    }).state('app.classusers', {
		        url: "/class/:classid/users",
		        templateUrl: "assets/js/class/users/classUsers.html",
		        controller: "classUsersController"
		    });

		$locationProvider.html5Mode(true);
	});
