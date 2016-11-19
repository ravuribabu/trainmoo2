'use strict';

require('../core');
require('../post');

angular.module('blog', ['ui.router', 'core', 'ui.bootstrap', 'post']);

require('./blogConfig');
require('./blogController');
require('./blogCard');
require('./Blog')
