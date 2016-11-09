'use strict';
		    
require('../core')
require('../shared/gallery');
require('../blog');

// require('../../../node_modules/ng-photoswipe/angular-photoswipe');

angular.module('post', ['ui.router', 'core', 'ui.bootstrap', 'gallery', 'blog']);

require('./postConfig');
require('./postFactory');
require('./postController');