'use strict';

var angular = require('angular');
require('angular-ui-router');
require('sweetalert');
require('angular-sweetalert');
require('select2');
require('../../../node_modules/angular-ui-select2/src/select2');
require('angular-bootstrap');

//User module definition
angular.module('userList', ['ui.router', 'oitozero.ngSweetAlert', 'ui.select2', 'ui.bootstrap']);

require('./userListConfig');
require('./userListController');
require('./userListFactory');