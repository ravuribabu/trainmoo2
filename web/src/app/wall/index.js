'use strict';
		    
require('../core')
require('../shared/gallery');
require('../post');
// require('../../../node_modules/ng-photoswipe/angular-photoswipe');

angular.module('wall', ['ui.router', 'core', 'ui.bootstrap', 'gallery', 'post']);

require('./directive/message');
require('./wallConfig');
require('./wallController');

