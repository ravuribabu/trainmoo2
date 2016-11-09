
'use strict';

var user = require('angular').module('user')

user.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider.state('app.appt.user', {
        url: "/user",
        templateUrl: "user/userEdit.tpl.html"
    });

	$locationProvider.html5Mode(true);
});
