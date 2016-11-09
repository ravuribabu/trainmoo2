'use strict';

require('../../../node_modules/alertify/src/alertify');
require('../../../node_modules/angular-ui-utils/modules/mask/mask');
require('../../../node_modules/ng-flow/dist/ng-flow');
require('../../../node_modules/select2/dist/js/select2');
require('../../../node_modules/angular-ui-select2/angular-ui-select2');
require('../../../node_modules/alertify/lib/alertify')
require('../../../node_modules/formatter.js/dist/jquery.formatter.min');
require('ngalertify')
require('lodash');
require('SweetAlert');
require('angular-animate');
require('../../../node_modules/angular-ui-bootstrap/dist/ui-bootstrap-tpls');
require('angularjs-datepicker');
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import Blog from '../blog/Blog';
import CommentEditor from '../shared/CommentEditor';

var core = angular.module('core', ['flow', 'ngAlertify', 'ngAnimate', 'ui.bootstrap', '720kb.datepicker']);

core.factory('_', ['$window', function($window) {
  return $window._; // assumes underscore has already been loaded on the page
}]);

core.directive('select2', function(){
	return {
		require: 'ngModel',
		restrict: 'A',
		link: function($scope, elm, $attributes, controller){
			elm.css('width','100%');
			elm.select2({ tags: true });
		}
	};
});



core.factory('lookupService', function($http){
	return {
		getLookups: function(group){
			return $http.get('api/lookup/'+ group);
		}
	};
});


core.factory('SweetAlert', [ '$rootScope', function ( $rootScope ) {

	var swal = window.swal;

	//public methods
	var self = {

		swal: function ( arg1, arg2, arg3 ) {
			$rootScope.$evalAsync(function(){
				if( typeof(arg2) === 'function' ) {
					swal( arg1, function(isConfirm){
						$rootScope.$evalAsync( function(){
							arg2(isConfirm);
						});
					}, arg3 );
				} else {
					swal( arg1, arg2, arg3 );
				}
			});
		},
		success: function(title, message) {
			$rootScope.$evalAsync(function(){
				swal( title, message, 'success' );
			});
		},
		error: function(title, message) {
			$rootScope.$evalAsync(function(){
				swal( title, message, 'error' );
			});
		},
		warning: function(title, message) {
			$rootScope.$evalAsync(function(){
				swal( title, message, 'warning' );
			});
		},
		info: function(title, message) {
			$rootScope.$evalAsync(function(){
				swal( title, message, 'info' );
			});
		},
		showInputError: function(message) {
			$rootScope.$evalAsync(function(){
				swal.showInputError( message );
			});
		},
		close: function() {
			$rootScope.$evalAsync(function(){
				swal.close();
			});
		}
	};

	return self;
}]);



require('./appForm')

core.directive('formatter', function(){
	return {
		require: 'ngModel',
		restrict: 'A',
		link: function($scope, elm, attrs, controller){
			 var pattern;
			// if (attrs.pattern === 'phone') {
			// 	pattern = '({{999}}) {{999}}-{{9999}}'
			// }
			if (attrs.pattern) {
		        pattern = attrs.pattern.replace(/\[\[/g, '{{').replace(/\]\]/g, '}}');
		      }
			elm.formatter({pattern: pattern, persistent: true});
		}
	};
});

// Google Map
core.directive('gmap', function($rootScope, lazyLoadGmapApi) {

  return {
    restrict: 'CA', // restrict by class name
    scope: {
    	placeid: '=',
    	address: '='
    },
    templateUrl: 'shared/gmap.tpl.html',
    link: function(scope, element, attrs) {
			

		var map = null;
		var marker = null;
		var input = null;


		scope.$watch('placeid', function(newValue, oldValue) {
			if (newValue && (!oldValue || (newValue === oldValue))){
				// Loads google map script
		        lazyLoadGmapApi.then(function() {
		        	initializeMap();

		        });
			}
			
		});
        
      
      // Initialize the maph
      function initializeMap() {

      	var mapOptions = {
          zoom: 15,
          mapTypeControl: false,
          streetViewControl : false,
          rotateControl : false,
          fullscreenControl: false
        };

        var elm = angular.element(element[0].querySelector('.gmapview'));
      	map = new google.maps.Map(elm[0], mapOptions);
      	$rootScope.map = map;
      	var service = new google.maps.places.PlacesService(map);
      	if (scope.placeid) {
      		service.getDetails({placeId: scope.placeid}, function(result, status){
	      		if (status == google.maps.places.PlacesServiceStatus.OK) {
				    marker = new google.maps.Marker({
				      map: map,
				      draggable: true,
	  				  animation: google.maps.Animation.DROP,
	  				  position: result.geometry.location
				    });
				    map.setCenter(result.geometry.location);
				    google.maps.event.addListener(marker, "dragend", locationSelected); 

				  }
	      	});
      	}
      	

         input = document.getElementById('pac-input');
		var autocomplete = new google.maps.places.Autocomplete(input);
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

		var controlUI = document.getElementById('locateMeDiv');
		 controlUI.addEventListener('click', function() {
		    locateCurrent();
		  });
		map.controls[google.maps.ControlPosition.TOP_LEFT].push(controlUI);


		// Bias the autocomplete results towards current map's viewport.
		map.addListener('bounds_changed', function() {
		  autocomplete.setBounds(map.getBounds());
		});

		// Listen for the event fired when the user selects a prediction and retrieve
		// more details for that place.
		autocomplete.addListener('place_changed', function() {
			var place = autocomplete.getPlace();
			selectPlace(place);
		});

      }

      function selectPlace(place, latlng) {

      	//marker.setVisible(false);
		if (!place.geometry) {
			window.alert("Autocomplete's returned place contains no geometry");
			return;
		}

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			//map.setZoom(15);  
		}

		if (latlng) {
			marker.setPosition(latlng);
		} else {
			marker.setPosition(place.geometry.location);
		}
		
		//marker.setVisible(true);

		scope.placeid = place.place_id;
		scope.address = (place.name? (place.name + ', ') : '') + place.formatted_address;

		input.value = scope.address;

		scope.$apply();


      }

      function selectPlaceByLatlng(latlng) {
      	 var geocoder = new google.maps.Geocoder;
      	 geocoder.geocode({'location': latlng}, function(results, status) {
		    if (status === 'OK') {
		      if (results[0]) {
		        selectPlace(results[0], latlng);
		      } else {
		        window.alert('No results found');
		      }
		    } else {
		      window.alert('Geocoder failed due to: ' + status);
		    }
		  });
      }

      function locationSelected(event){

		  var lat = event.latLng.lat(); 
          var lng = event.latLng.lng(); 

          var latlng = {lat: lat, lng: lng};
          selectPlaceByLatlng(latlng);
               
      }

      function locateCurrent() {

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            selectPlaceByLatlng(latlng);
             
          }, function() {
            window.alert('No results found');
          });
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }



      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      }
    }
  };
});

core.service('lazyLoadGmapApi', function lazyLoadGmapApi($window, $q) {
  

  var loadScript = function() {
    console.log('Loading Google maps api script');
    var s = document.createElement('script');
    s.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyBNAh6zeQbyUXD1cQSr01V4s3g7QHt5oi0&libraries=places&language=en&callback=initMap';
    document.body.appendChild(s);
  }

  //Create promise
  var deferred = $q.defer()
  $window.initMap = function() {
    deferred.resolve();
  }

  if (document.readyState === "complete") {
  	loadScript();
  }
  else {
    $window.addEventListener('load', loadScript, false);
  }

  return deferred.promise
});


core.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
 
                event.preventDefault();
            }
        });
    };
});



core.directive('blog', function(){
  return {
    require: '?form',
    restrict: 'AE',
    scope:{
      content: '=',
      readonly: '@'
    },
    controller: function($scope) {
      console.log($scope.content);
    },
    link: function(scope, elm, $attributes, formController){

      var readonly = false;

      if (scope.readonly && scope.readonly === 'true') {
        readonly = true;
      }
      scope.$watch('content', function(value){
          var draftContent = scope.content; 
          ReactDOM.render(<Blog content={draftContent} update={setContent} readonly={readonly}/>, elm[0]);
      });

      function setContent(content){
        scope.content = content;
        scope.$apply();
        if (formController) {
        	formController.$setDirty(true);
        }
      } 
    }
  };
});


core.directive('commentEditor', function(){
  return {
    require: '?form',
    restrict: 'AE',
    scope:{
      content: '=',
      readonly: '@'
    },
    controller: function($scope) {
    },
    link: function(scope, elm, $attributes, formController){

      let readonly = false;

      if (scope.readonly && scope.readonly === 'true') {
        readonly = true;
      }

      scope.$watch('content', function(value){
		let draftContent = scope.content; 
		let commentEditor = <CommentEditor content={draftContent} update={setContent} readonly={readonly}/>;
		ReactDOM.render(commentEditor, elm[0]);
      });

      

      function setContent(content){
      	if (scope.content === content) {
      		return;
      	}
      	
        scope.content = content;
        scope.$apply();
        if (formController) {
        	formController.$setDirty(true);
        }
      } 
    }
  };
});






