'use strict';

var angular = require('angular');

var core = angular.module('core', ['ngRoute', 'ui.router', 'oitozero.ngSweetAlert', 'ui.mask', 'ui.select2', 'flow']);

core.logit = function(data){
	console.log('ERROR: ' + data);
}

core.run(function($rootScope){

});

core.config(function($stateProvider, $urlRouterProvider, $locationProvider) {

	$locationProvider.html5Mode(true);
});


core.directive('compareTo', function () {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function (scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function (modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function () {
                ngModel.$validate();
            });
        }
    };
});


//Capitalize first letter of every word in the sentence
core.filter('capitalize', function() {
    return function(s)
    	{
    		return (angular.isString(s) && s.length > 0) ? s.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : s ;
    	} ;
});


core.directive('perfectScrollbar', ['$parse', '$window',
function ($parse, $window) {
    var psOptions = ['wheelSpeed', 'wheelPropagation', 'minScrollbarLength', 'useBothWheelAxes', 'useKeyboard', 'suppressScrollX', 'suppressScrollY', 'scrollXMarginOffset', 'scrollYMarginOffset', 'includePadding'//, 'onScroll', 'scrollDown'
    ];

    return {
        restrict: 'EA',
        transclude: true,
        template: '<div><div ng-transclude></div></div>',
        replace: true,
        link: function ($scope, $elem, $attr) {
            var jqWindow = angular.element($window);
            var options = {};
//	            if (!$scope.app.isMobile) {
                for (var i = 0, l = psOptions.length; i < l; i++) {
                    var opt = psOptions[i];
                    if ($attr[opt] !== undefined) {
                        options[opt] = $parse($attr[opt])();
                    }
                }

                $scope.$evalAsync(function () {
                    $elem.perfectScrollbar(options);
                    var onScrollHandler = $parse($attr.onScroll);
                    $elem.scroll(function () {
                        var scrollTop = $elem.scrollTop();
                        var scrollHeight = $elem.prop('scrollHeight') - $elem.height();
                        $scope.$apply(function () {
                            onScrollHandler($scope, {
                                scrollTop: scrollTop,
                                scrollHeight: scrollHeight
                            });
                        });
                    });
                });

                function update(event) {
                    $scope.$evalAsync(function () {
                        if ($attr.scrollDown == 'true' && event != 'mouseenter') {
                            setTimeout(function () {
                                $($elem).scrollTop($($elem).prop("scrollHeight"));
                            }, 100);
                        }
                        $elem.perfectScrollbar('update');
                    });
                }

                // This is necessary when you don't watch anything with the scrollbar
                $elem.bind('mousemove', update);

                // Possible future improvement - check the type here and use the appropriate watch for non-arrays
                if ($attr.refreshOnChange) {
                    $scope.$watchCollection($attr.refreshOnChange, function () {
                        update();
                    });
                }

                // this is from a pull request - I am not totally sure what the original issue is but seems harmless
                if ($attr.refreshOnResize) {
                    jqWindow.on('resize', update);
                }

                $elem.bind('$destroy', function () {
                    jqWindow.off('resize', update);
                    $elem.perfectScrollbar('destroy');
                });
//            }
        }
    };
}]);


/**
 * Make element 100% height of browser window.
 */
core.directive('ctFullheight', ['$window', '$rootScope', '$timeout',
	function ($window, $rootScope, $timeout) {
	    return {
	        restrict: "AE",
	        scope: {
	            ctFullheightIf: '&'
	        },
	        link: function (scope, elem, attrs) {
	            var $win = $($window);
	            var $document = $(document);
	            var exclusionItems;
	            var exclusionHeight;
	            var setHeight = true;
	            var page;

	            scope.initializeWindowSize = function () {
	                $timeout(function () {
	                    exclusionHeight = 0;
	                    if (attrs.ctFullheightIf) {
	                        scope.$watch(scope.ctFullheightIf, function (newVal, oldVal) {
	                            if (newVal && !oldVal) {
	                                setHeight = true;
	                            } else if (!newVal) {
	                                $(elem).css('height', 'auto');
	                                setHeight = false;
	                            }
	                        });
	                    }

	                    if (attrs.ctFullheightExclusion) {
	                        var exclusionItems = attrs.ctFullheightExclusion.split(',');
	                        angular.forEach(exclusionItems, function (_element) {
	                            exclusionHeight = exclusionHeight + $(_element).outerHeight(true);
	                        });
	                    }
	                    if (attrs.ctFullheight == 'window') {
	                        page = $win;
	                    } else {
	                        page = $document;
	                    }

	                    scope.$watch(function () {
	                        scope.__height = page.height();
	                    });
	                    if (setHeight) {
	                        $(elem).css('height', 'auto');
	                        if (page.innerHeight() < $win.innerHeight()) {
	                            page = $win;
	                        }
	                        console.log("setting height: " + (page.innerHeight() - exclusionHeight))
	                        $(elem).css('height', page.innerHeight() - exclusionHeight);
	                    }
	                }, 600);
	            };

	            scope.initializeWindowSize();
	            scope.$watch('__height', function (newHeight, oldHeight) {
	                scope.initializeWindowSize();
	            });
	            $win.on('resize', function () {
	                scope.initializeWindowSize();
	            });

	        }
	    };

	    return core;

	}]);
