'use strict';

var login = require('angular').module('login');


login.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider.state('app.login', {
        url: "/login",
        templateUrl: "login/login.tpl.html",
        controller: 'loginController'
    }).state('app.signup', {
        url: "/signup",
        templateUrl: "login/signup.tpl.html",
        controller: 'signupController'
    });

	$locationProvider.html5Mode(true);
});
