'use strict';

var login = require('angular').module('post');

post.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider.state('app.post', {
        url: "/post/:id",
        templateUrl: "assets/js/post/post.html",
        controller: 'postController',
        title: 'Post',
        ncyBreadcrumb: {
            label: 'post'
        }

    });

	$locationProvider.html5Mode(true);
});
