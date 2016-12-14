'use strict';

var events= angular.module('events');

events.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$stateProvider.state('app.apph.events', {
        url: "/events",
        templateUrl: "events/events.tpl.html",
        controller: 'eventsController',
        controllerAs: 'vm1'
    });

	$locationProvider.html5Mode(true);
});

