
	'use strict';

	 var blog = require('angular').module('blog');
	 
	 blog.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

		$stateProvider
		.state('app.blog', {
		        url: "/blog",
		        templateUrl: "assets/js/blog/blog.html",
		        title: 'Blog',
		        controller: 'blogController',
		        ncyBreadcrumb: {
		            label: 'Blog'
		        }

	    	})
		.state('app.blogread', {
		        url: "/blog/read/:postid",
		        templateUrl: "assets/js/blog/blogRead.html",
		        title: 'Blog',
		        controller: 'blogReadController',
		        ncyBreadcrumb: {
		            label: 'Blog'
		        }

	    	})

		$locationProvider.html5Mode(true);
	});
