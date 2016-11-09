'use strict';

var post = require('angular').module('post');

post.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider.state('app.post', {
        url: "/post/:id",
        templateUrl: "post/post.tpl.html",
        controller: 'postController',
    });

	$locationProvider.html5Mode(true);
});
