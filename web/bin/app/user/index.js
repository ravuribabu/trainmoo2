'use strict';
var angular = require('angular');
angular.module('user', ['ui.router', 'core', 'ui.mask', 'ui.select2']);

require('./userFactory');
require('./userController');
require('./userConfig');
