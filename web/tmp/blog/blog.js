'use strict';

var angular = require('angular')
require('angular-sweetalert-promised')
require('angular-ui-utils')
require('angular-ui-select2')
require('ng-flow')
require('angular-ckeditor')

angular.module('blog', ['ui.router', 'oitozero.ngSweetAlert', 'ui.mask', 'ui.select2', 'flow', 'ckeditor', 'post']);
