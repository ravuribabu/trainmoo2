import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Calendar from './Calendar';
const events = angular.module('events');

events.directive('calendar', function(){
  return {
    restrict: 'AE',
    scope:{
    	events: "=",
    	onSelectEvent: "&",
    	onSelectSlot: "&",
      onView: "&",
      onNavigate: "&",
      view: '@'
    },

    link: function(scope, elm, $attributes){
      scope.$watch('events', function(events, oldEvents){
	      	ReactDOM.render(<Calendar events={events} onSelectEvent={scope.onSelectEvent} onSelectSlot={scope.onSelectSlot} onView={scope.onView} onNavigate={scope.onNavigate} view={scope.view}/>, elm[0]);
      })
    }
  };
});