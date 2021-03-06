'use strict';
		    
require('../core')
require('../shared/gallery');

// require('../../../node_modules/ng-photoswipe/angular-photoswipe');

angular.module('school', ['ui.router', 'core', 'ui.bootstrap', 'gallery', 'richtext', 'events']);

require('./schoolFactory');
require('./schoolEditController');
require('./schoolController');
require('./schoolConfig');
require('./class/classEditController');
require('./users/classUsersController');
require('./users/schoolUsersController');
require('./users/schoolUserController');

