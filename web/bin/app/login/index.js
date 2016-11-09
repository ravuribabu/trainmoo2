'use strict';
		    
require('../core')
angular.module('login', ['ui.router', 'core']);

require('./authenticationFactory')
require('./login.config');
require('./loginController');
require('./signupController');
