'use strict';

var blog = require('angular').module('blog');

blog.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider.state('app.blog', {
        url: "/blog/:postid",
        templateUrl: "blog/blog.tpl.html",
        controller: 'blogController',
        controllerAs: 'vm'
    });

	$locationProvider.html5Mode(true);
});
