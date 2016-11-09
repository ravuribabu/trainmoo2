'use strict';

var wall = require('angular').module('wall');

wall.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider.state('app.apph.wall', {
        url: "/wall",
        templateUrl: "wall/wall.tpl.html",
        controller: 'wallController',
    });

	$locationProvider.html5Mode(true);
});
