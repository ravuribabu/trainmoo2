'use strict';

require('../core');
require('../blog');

angular.module('blog', ['ui.router', 'core', 'ui.bootstrap', 'post']);

require('./blogConfig');
require('./blogController');