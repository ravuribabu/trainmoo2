var wall = require('angular').module('wall');
var moment =require('moment');
var _ = require('lodash');
require('./navController');
require('./commentController');

wall.directive('message', function(){
	return {
			restict : 'EA',
			scope: {
				msg : '=',
			},
			templateUrl: 'wall/directive/message.tpl.html',
			controller: 'messageController'
	};
});



wall.directive('notification', function(){
	return {
			restict : 'EA',
			scope: {
				msg : '=',
			},
			templateUrl: 'wall/directive/notification.tpl.html',
			controller: 'messageController'
	};
});

wall.directive('assignment', function(){
	return {
			restict : 'EA',
			scope: {
				msg : '=',
			},
			templateUrl: 'wall/directive/assignment.tpl.html',
			controller: 'messageController'
	};
});


// wall.directive('blogCard', function(){
// 	return {
// 			restict : 'EA',
// 			scope: {
// 				msg : '=',
// 			},
// 			templateUrl: 'wall/directive/blog.tpl.html',
// 			controller: 'messageController'
// 	};
// });

wall.filter('postTime', function(){
	return function(d) {
		var output;
		return moment(d).format('MMM DD h:mA');
	}
});


wall.filter('stripHtml',function() {
	return function strip(html)
			{
			   var tmp = document.createElement("DIV");
			   tmp.innerHTML = html;
			   var stripped = tmp.textContent || tmp.innerText || "";
			   return stripped.substring(1, 200) + '...';
			};
} );

wall.filter('listToString', function(){
	return function listToString(list){
		return _.join(list, ', ');
	}
});


