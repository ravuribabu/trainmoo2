'use strict';

var angular = require('angular')
require('angular-sweetalert-promised')
require('angular-ui-utils')
require('angular-ui-select2')
require('ng-flow')
require('angular-bootstrap')
require('angular-bootstrap-calendar')
require('moment')

//User module definition
angular.module('class', ['user', 'ui.router', 'oitozero.ngSweetAlert', 'ui.mask', 'ui.select2', 'flow', 'ngTable', 'ngAside', 'ui.bootstrap', 'mwl.calendar', 'core']);
