
'use strict';


var angular = require('angular')
var classModule = angular.module('class')
var moment = require('moment')
var utils = require('utils') //../../core/utils

classModule.controller('eventsController',
	function($scope, $rootScope, $http, $window, $state, $timeout, SweetAlert, flowFactory, $stateParams, ngTableParams, $filter, $aside, classFactory, $uibModal){

			    var date = new Date();
			    var d = date.getDate();
			    var m = date.getMonth();
			    var y = date.getFullYear();

				init();

				function init() {

				    initializeCalendarView();

				    $scope.events = [];
				    $scope.eventsOnCalendar = [];

				    $scope.classid = $stateParams.classid;
			   		if ($scope.classid ) {
			   			classFactory.getEvents($scope.classid)
								.success(function(data){
									$scope.events = data;
									refreshCalendarEvents();

								})
								.error(function(err){
									console.log("EVENT ERROR: " + err);
								});
			   		}

				}

				function initializeCalendarView(){
				  $scope.calendarView = 'month';
			      $scope.calendarDate = new Date();
				  $scope.mytime = new Date();
		  	      $scope.hstep = 1;
				  $scope.mstep = 15;

				  $scope.options = {
				    hstep: [1, 2, 3],
				    mstep: [1, 5, 10, 15, 25, 30]
				  };

				  $scope.ismeridian = true;
				  $scope.toggleMode = function() {
				    $scope.ismeridian = ! $scope.ismeridian;
				  };

				  $scope.update = function() {
				    var d = new Date();
				    d.setHours( 14 );
				    d.setMinutes( 0 );
				    $scope.mytime = d;
				  };
				}




			    function refreshCalendarEvents(event){

			    	$scope.eventsOnCalendar = createEventsOnCalendar($scope.events);

			    	_.forEach($scope.events, function(e) {
			    		if (!e._id){
			    			classFactory.createEvent($scope.classid, e);
			    		}
			    		if (event && e._id && e._id === event.parent._id) {
			    			classFactory.updateEvent(e);
			    		}
			    	});
			    }

			    function removeEvent(event) {
			    	_.forEach($scope.events, function(e, index) {
			    		if (e._id && e._id === event.parent._id) {
			    			$scope.events.splice(index);
			    			classFactory.removeEvent(e._id);
			    			return;
			    		}
			    	});

			    	refreshCalendarEvents();
			    }

			    function showModal(action, event) {
			        var modalInstance = $uibModal.open({
			            templateUrl: 'calendarEvent.html',
			            placement: 'right',
			            size: 'md',
			            backdrop: true,
			            controller: function ($scope, $uibModalInstance) {

			                $scope.$modalInstance = $uibModalInstance;
			                $scope.action = action;

			                $scope.event = event;
			                // $scope.event.parent.eventDate.start = '12/21/2016';
			                // $scope.event.parent.eventDate.end = '12/31/2016';
			                $scope.cancel = function () {
			                    $uibModalInstance.dismiss('cancel');
			                    refreshCalendarEvents(event);
			                };
			                $scope.deleteEvent = function () {
			                    $uibModalInstance.close($scope.event, $scope.event);
			                };
			                $scope.daysInWeek = [ { name: 'Sunday' } , { name:'Monday'} , { name: 'Tuesday'}, { name: 'Wednesday'}, { name: 'Thursday'}, { name:'Friday'}, { name:'Saturday'}];
							_.forEach($scope.daysInWeek, function(day) {
								if ($scope.event.parent.days!='undefined' && $scope.event.parent.days.indexOf(day.name.toLowerCase()) >= 0) {
									day.checked = true;
								}
							});
							$scope.selectDay = function() {
								$scope.event.parent.days = _.map( _.filter($scope.daysInWeek, {checked:true}), function(o) { return o.name.toLowerCase() } );
							};


			            }
			        });
			        modalInstance.result.then(function (selectedEvent, action) {
			            $scope.eventDeleted(selectedEvent);

			        });
			    }


			    $scope.eventClicked = function (event) {
			        showModal('Clicked', event);
			    };


			    $scope.addEvent = function () {

			    	var event = {		class:$scope.classid,
										eventTime : {
										},
										eventDate: {
										},
										days: []
					            };
					$scope.events.push(event);


			        $scope.eventsOnCalendar.push({
			            title: 'New Event',
			            startsAt: new Date(y, m, d, 10, 0),
			            endsAt: new Date(y, m, d, 11, 0),
			            type: 'job',
			            parent: event
			        });
			        $scope.eventEdited($scope.eventsOnCalendar[$scope.eventsOnCalendar.length - 1]);

			    };

			    $scope.eventEdited = function (event) {
			        showModal('Edited', event);
			    };

			    $scope.eventDeleted = function (event) {

			        SweetAlert.swal({
			            title: "Are you sure?",
			            text: "Your will not be able to recover this event!",
			            type: "warning",
			            showCancelButton: true,
			            confirmButtonColor: "#DD6B55",
			            confirmButtonText: "Yes, delete it!",
			            cancelButtonText: "No, cancel plx!",
			            closeOnConfirm: false,
			            closeOnCancel: false
			        }, function (isConfirm) {
			            if (isConfirm) {
			                removeEvent(event);
			                SweetAlert.swal("Deleted!", "Event has been deleted.", "success");
			            } else {
			                SweetAlert.swal("Cancelled", "Event is safe :)", "error");
			            }
			        });
			    };


			    $scope.toggle = function ($event, field, event) {
			        $event.preventDefault();
			        $event.stopPropagation();

			        event[field] = !event[field];
			    };


			    function createEventsOnCalendar(events) {


			    	var eventsOnScheduler = [];

			    	_.forEach(events, function(event) {

		                	console.log(event);

		                	event.eventDate.start = new Date(event.eventDate.start);
		                	event.eventDate.end = new Date(event.eventDate.end);
							var startDate = moment(new Date(event.eventDate.start));
							var endDate = moment(new Date(event.eventDate.end));
							var noOfDays = endDate.diff(startDate, 'days') + 1;

							var startTime = moment(event.eventTime.start);
							var endTime = moment(event.eventTime.end);

							if (event.repeat) {

								var duration = moment.duration(endTime.diff(startTime)).humanize();

								for (var day = 0; (day < noOfDays) ; day++) {
									var currDate = startDate.clone().add(day, 'days');
									if (event.frequency === "weekly" && event.days != 'undefined' && event.days.length > 0 ) {
										var weekday = currDate.format('dddd').toLowerCase();
										if (event.days.indexOf(weekday) < 0) {
											continue;
										}
									}

									var eventStart = currDate.clone();
									var eventEnd = currDate.clone();
									eventStart.set({ 'hour': startTime.hours(),'minute': startTime.minutes()});
									eventEnd.set({ 'hour': endTime.hours(),'minute': endTime.minutes()});

									var newEvent = {
										title: event.title,
										startsAt: eventStart.toDate(),
										type: event.type,
										endsAt: eventEnd.toDate(),
										duration: duration,
										parent: event
									}
									eventsOnScheduler.push(newEvent);
								}
							}
							else {

									var eventStart = startDate.clone();
									var eventEnd = endDate.clone();
									eventStart.set({ 'hour': startTime.hours(),'minute': startTime.minutes()});
									eventEnd.set({ 'hour': endTime.hours(),'minute': endTime.minutes()});

									var duration = moment.duration(eventEnd.diff(eventStart)).humanize();

									var newEvent = {
										title: event.title,
										startsAt: eventStart.toDate(),
										endsAt: eventEnd.toDate(),
										type: event.type,
										duration: duration,
										parent: event
									}
									eventsOnScheduler.push(newEvent);
							}
							console.log(eventsOnScheduler);
						}	);

			    	return eventsOnScheduler;

				}

			});
