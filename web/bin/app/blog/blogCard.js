'use strict';

var blog = require('angular').module('blog');

blog.directive('blogCard', function(postFactory){
  return {
    restrict: 'AE',
    templateUrl: 'blog/blogCard.tpl.html',
    scope: {
    	draft: '='
    },
  };
});

