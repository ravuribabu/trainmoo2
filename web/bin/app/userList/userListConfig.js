'use strict';

var angular = require('angular');
var userList = angular.module('userList');
userList.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider.state('app.users', {
        url: "/users",
        templateUrl: "userList/userList.tpl.html",
        controller: 'userListController',
    });

	$locationProvider.html5Mode(true);
});
