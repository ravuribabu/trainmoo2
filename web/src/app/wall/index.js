'use strict';
		    
require('../core')
require('../shared/gallery');
require('../post');
require('../comment');
require('../nav');
// require('../../../node_modules/ng-photoswipe/angular-photoswipe');

angular.module('wall', ['ui.router', 'core', 'ui.bootstrap', 'gallery', 'post', 'comment', 'nav']);

require('./wallConfig');
require('./wallController');


