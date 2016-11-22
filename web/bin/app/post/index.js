'use strict';
		    
require('../core')
require('../shared/gallery');
require('../richtext');
require('../events')
// require('../../../node_modules/ng-photoswipe/angular-photoswipe');

angular.module('post', ['ui.router', 'core', 'ui.bootstrap', 'gallery', 'richtext', 'events']);

require('./postFactory');
require('./postController');