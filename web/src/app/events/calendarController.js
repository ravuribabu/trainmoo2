import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import Calendar from './Calendar';

const events = angular.module('events');

events.directive('calendar', function(postFactory){
  return {
    restrict: 'AE',
    scope:{

    },
    controller: function($scope) {
    },
    link: function(scope, elm, $attributes){
      ReactDOM.render(<Calendar />, elm[0]);
    }
  };
});

