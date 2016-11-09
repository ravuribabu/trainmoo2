'use strict';

var wall = require('angular').module('wall');

return wall.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider.state('app.wall', {
        url: "/wall/:userid",
        templateUrl: "assets/js/wall/wall.html",
        controller: 'wallController',
        title: 'Wall',
        ncyBreadcrumb: {
            label: 'wall'
        }

    });

	$locationProvider.html5Mode(true);
});
