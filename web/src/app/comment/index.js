'use strict';
		    

const _ = require('lodash');
const moment = require('moment');

require('../core')
require('../shared/gallery');
require('../post')

const comment = angular.module('comment', ['ui.router', 'core', 'ui.bootstrap', 'gallery', 'post']);

require('./commentController');
require('./submitActionController');
require('./taskActionController');
require('./repliesController');

comment.filter('postTime', function(){
	return function(d) {
		var output;
		return moment(d).format('MMM DD h:mA');
	}
});


comment.filter('stripHtml',function() {
	return function strip(html)
			{
			   var tmp = document.createElement("DIV");
			   tmp.innerHTML = html;
			   var stripped = tmp.textContent || tmp.innerText || "";
			   return stripped.substring(1, 200) + '...';
			};
} );

comment.filter('listToString', function(){
	return function listToString(list){
		return _.join(list, ', ');
	}
});

