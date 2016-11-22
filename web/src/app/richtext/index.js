'use strict';

require('../core');
require('../post');

angular.module('richtext', ['ui.router', 'core', 'ui.bootstrap', 'post']);

// require('./richtextConfig');
require('./richtextController');
require('./richtextCard');
require('./RichText')
