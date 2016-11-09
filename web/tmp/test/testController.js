	var test = require('angular').module('test');
	var moment = require('moment');
	var utils = require('utils');

	test.controller('testController',
		  function($timeout, $q, $log, $scope) {

		  	console.log('testController');

		    $scope.simulateQuery = false;
		    $scope.isDisabled    = false;
		    // list of `state` value/display objects
		    $scope.states        = loadAll();
		    $scope.selectedItemChange = selectedItemChange;
		    $scope.searchTextChange   = searchTextChange;
		    $scope.newState = newState;
		    function newState(state) {
		      alert("Sorry! You'll need to create a Constituion for " + state + " first!");
		    }
		    // ******************************
		    // Internal methods
		    // ******************************
		    /**
		     * Search for states... use $timeout to simulate
		     * remote dataservice call.
		     */
		    $scope.querySearch = function(query) {
		      var results = query ? $scope.states.filter( createFilterFor(query) ) : $scope.states,
		          deferred;
		      if ($scope.simulateQuery) {
		        deferred = $q.defer();
		        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
		        return deferred.promise;
		      } else {
		        return results;
		      }
		    }
		    function searchTextChange(text) {
		      $log.info('Text changed to ' + text);
		    }
		    function selectedItemChange(item) {
		      $log.info('Item changed to ' + JSON.stringify(item));
		    }
		    /**
		     * Build `states` list of key/value pairs
		     */
		    function loadAll() {
		      var allStates = 'Alabama, Alaska, Arizona, Arkansas, California, Colorado, Connecticut, Delaware,\
		              Florida, Georgia, Hawaii, Idaho, Illinois, Indiana, Iowa, Kansas, Kentucky, Louisiana,\
		              Maine, Maryland, Massachusetts, Michigan, Minnesota, Mississippi, Missouri, Montana,\
		              Nebraska, Nevada, New Hampshire, New Jersey, New Mexico, New York, North Carolina,\
		              North Dakota, Ohio, Oklahoma, Oregon, Pennsylvania, Rhode Island, South Carolina,\
		              South Dakota, Tennessee, Texas, Utah, Vermont, Virginia, Washington, West Virginia,\
		              Wisconsin, Wyoming';
		      return allStates.split(/, +/g).map( function (state) {
		        return {
		          value: state.toLowerCase(),
		          display: state
		        };
		      });
		    }
		    /**
		     * Create filter function for a query string
		     */
		    function createFilterFor(query) {
		      var lowercaseQuery = angular.lowercase(query);
		      return function filterFn(state) {
		        return (state.value.indexOf(lowercaseQuery) === 0);
		      };
		    }
		  });
