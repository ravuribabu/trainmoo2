'use strict';

var test = require('angular').module('test');

test.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

$stateProvider.state('app.test', {
      url: "/test",
      templateUrl: "assets/js/test/test.html",
      controller: 'testController',
      title: 'Post',
      ncyBreadcrumb: {
          label: 'post'
      }

  });

$locationProvider.html5Mode(true);
});
