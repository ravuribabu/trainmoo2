"use strict";


//bootstrapping app
require('../common/breakpoints');
Breakpoints();


window.$ = window.jQuery =  require('jquery');
require('bootstrap');
require('../common/jquery-asScroll');
require('jquery.mousewheel');
require('../common/jquery.asScrollable.all');
require('../common/jquery-asHoverScroll');
require('../common/core');
require('../common/site');

require('../common/menu');
require('../common/menubar');
require('../common/sidebar');

// require('../common/top/menu');
// require('../common/top/menubar');
// require('../common/top/sidebar');
require('../common/jquery-slidePanel');
require('../common/jquery-maskmoney');

var angular = require('angular');


(function(document, window, $) {
	   
	    'use strict';
	   
	    var Site = window.Site;
	    $(document).ready(function() {
	      	Site.run();
	    });

	    // console.log('Loading google script');
	    // var s = document.createElement('script');
	    // s.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyBNAh6zeQbyUXD1cQSr01V4s3g7QHt5oi0&libraries=places&language=en';
    	// document.body.appendChild(s);

	})(document, window, jQuery);


console.log('LOADING APPJS');
//var app = angular.module('app', ['core', 'ser', 'userList', 'class', 'wall', 'blog', 'login', 'test']);
//var app = angular.module('app', ['userList', 'templates.app']);

require('./userList');
require('./login');
require('./school');
require('./user');
require('./wall');


var app = angular.module('app', ['userList', 'templates.app', 'login', 'school', 'user', 'wall' ]);
require('./appController');

app.run(function($rootScope){
	
	$("#mainContainer").show();

	$rootScope.$on('$stateChangeSuccess', function(){
		document.getElementById('fouc').style.display = 'block';

	});

	// $rootScope.$on('$locationChangeSuccess', function() {
 //        document.getElementById('fouc').style.display = 'block';
 //    });        

});

app.directive('scrollable', function ($window) {
return {
        restrict: 'A',
        link: function ($scope, $element, $attributes) {
            $element.asScrollable({
				   namespace: "scrollable",
				});
        }
    };
});


app.config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

		$urlRouterProvider.otherwise("/app/login");

		$stateProvider.state('app', {
	        url: "/app",
	        templateUrl: "shared/app.tpl.html",
	        abstract: true
	    }).state('app.appt', {
		        url: "/appt",
		        templateUrl: "shared/apptop.tpl.html",
		        abstract: true
		    })
	    .state('app.apph', {
		        url: "/apph",
		        templateUrl: "shared/apph.tpl.html",
		        abstract: true
		    });
		// 	.state('landing', {
		//     url: '/trainmoo',
		//     template: '<div ui-view class="fade-in-right-big smooth"></div>',
		//     abstract: true,
		// }).state('landing.welcome', {
		//     url: '/welcome',
		//     templateUrl: "assets/landing-page.html"
		// });

		$locationProvider.html5Mode(true);
		//$httpProvider.interceptors.push('authInterceptor');

	});






app.directive('landingHeader', function ($window) {
return {
        restrict: 'A',
        link: function ($scope, $element, $attributes) {
            angular.element($window).bind("scroll", function () {
                //if (this.pageYOffset >= 60) {
                    $element.addClass('min');
               // } else {
               //     $element.removeClass('min');
               // }
            });

        }
    };
});



app.directive('selectpicker', function(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function($scope, $element, $attributes){

			$element.selectpicker(
					{
					    style: "btn-select",
					    iconBase: "icon",
					    tickIcon: "wb-check"
					  }
				);
		}
	};
});


app.directive('maskmoney', function(){
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function($scope, $element, $attributes){

			const value = $scope.ngModel;
			console.log('MASKMONEY:' + value);

			$element.maskMoney();
		}
	};
});

app.directive('floating', function(){
	return {
		restrict: 'A',
		link: function($scope, $element, $attributes) {
			var $this = $element;
			if ($this.data('material') === true) {
                return;
              }

              var $control = $this.find('.form-control');

              // Add hint label if required
              if ($control.attr("data-hint")) {
                $control.after("<div class=hint>" + $control.attr("data-hint") + "</div>");
              }

              if ($this.hasClass("floating")) {
                // Add floating label if required
                if ($control.hasClass("floating-label")) {
                  var placeholder = $control.attr("placeholder");
                  $control.attr("placeholder", null).removeClass("floating-label");
                  $control.after("<div class=floating-label>" + placeholder + "</div>");
                }

                // Set as empty if is empty
                if ($control.val() === null || $control.val() == "undefined" || $control.val() === "") {
                  $control.addClass("empty");
                }
              }

              // Support for file input
              if ($control.next().is("[type=file]")) {
                $this.addClass('form-material-file');
              }

              $this.data('material', true);



			  $element.on("keydown.site.material paste.site.material", ".form-control", function(e) {
		        if (_isChar(e)) {
		          $(this).removeClass("empty");
		        }
		      }).on("keyup.site.material change.site.material", ".form-control", function() {
		        var $this = $(this);
		        if ($this.val() === "" && (typeof $this[0].checkValidity != "undefined" && $this[0].checkValidity())) {
		          $this.addClass("empty");
		        } else {
		          $this.removeClass("empty");
		        }
		      }).on("focus", ".form-material-file", function() {
		        $(this).find("input").addClass("focus");
		      })
		      .on("blur", ".form-material-file", function() {
		        $(this).find("input").removeClass("focus");
		      })
		      .on("change", ".form-material-file [type=file]", function() {
		        var value = "";
		        $.each($(this)[0].files, function(i, file) {
		          value += file.name + ", ";
		        });
		        value = value.substring(0, value.length - 2);
		        if (value) {
		          $(this).prev().removeClass("empty");
		        } else {
		          $(this).prev().addClass("empty");
		        }
		        $(this).prev().val(value);
		      });


		      function _isChar(e) {
			      if (typeof e.which == "undefined") {
			        return true;
			      } else if (typeof e.which == "number" && e.which > 0) {
			        return !e.ctrlKey && !e.metaKey && !e.altKey && e.which != 8 && e.which != 9;
			      }
			      return false;
			    }
	}
  }
});
