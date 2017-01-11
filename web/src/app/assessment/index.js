require('../core')
require('../shared/gallery');
require('../post')

const assessment = angular.module('assessment', ['ui.router', 'core', 'ui.bootstrap', 'gallery', 'post']);

require('./assessmentEditController');
require('./assessmentSAController');
require('./assessmentTFController');
require('./assessmentMCController');
require('./assessmentCardController');

require('./assessmentFactory');

