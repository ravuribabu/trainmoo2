'use strict';

var blog = require('angular').module('richtext');

blog.directive('richtextCard', function(postFactory){
  return {
    restrict: 'AE',
    templateUrl: 'richtext/richtextCard.tpl.html',
    scope: {
    	rtpost: '='
    },
  };
});

