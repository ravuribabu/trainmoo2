'use strict';
		    
require('../core')
require('../shared/gallery');
require('../richtext');
require('../events')
require('../assessment')

// require('../../../node_modules/ng-photoswipe/angular-photoswipe');

angular.module('post', ['ui.router', 'core', 'ui.bootstrap', 'gallery', 'richtext', 'events', 'assessment']);

require('./postFactory');
require('./postController');