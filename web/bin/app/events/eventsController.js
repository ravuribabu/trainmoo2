let moment = require('moment');

const events = angular.module('events');

events.controller('eventsController', function($scope, $rootScope, $uibModal, eventFactory, $aside) {

    let vm = this;
    vm.currentDate = new Date();
    vm.currentView = 'week';

    loadEvents(vm.currentDate, vm.currentView);
    vm.events = [];

    vm.openEvent = function(calendarEvent) {

      var modalInstance = $aside.open({
                  templateUrl: 'events/eventDetails.tpl.html',
                  size: 'md',
                  backdrop: true,
                  controller: 'eventDetailsController',
                  controllerAs: 'vm',
                  placement: 'right',
                  resolve:  {
                        params: function() {
                                return {
                                    'calendarEvent': calendarEvent,
                                };
                        }
                    }
              });

      modalInstance.result.then(function (event) {
          vm.event = event;
          loadEvents(vm.currentDate, vm.currentView);
        }, function () {
          console.log('Modal dismissed at: ' + new Date());
          loadEvents(vm.currentDate, vm.currentView);
        });


    }

    vm.onSelectEvent = (event) => {
    	vm.openEvent(event);
    }

    vm.onSelectSlot = (slotInfo) => {
    	console.log('Slot Selected: ' + JSON.stringify(slotInfo));

    	if (slotInfo.start === slotInfo.end) {
    		return;
    	}
    	
    	let newEvents = vm.events.slice();
        let calendarEvent = {
            title: 'New',
            'start': slotInfo.start,
            'end': slotInfo.end,
            event: undefined,
            isAllDay: false,
            isCustom: false,
            repeat: 'none',
        };

    	newEvents.push(calendarEvent);

    	vm.events = newEvents;
    	$scope.$apply();

        vm.openEvent(calendarEvent);
    }

    vm.onView = (view) => {
    	vm.currentView = view;
    	loadEvents(vm.currentDate, view);
    }

    vm.onNavigate = (date, view) => {
    	loadEvents(date, view);
    }

    function loadEvents (date, view){

    	vm.currentDate = date;
    	vm.currentView = view;
    	
    	let rangeStart = moment(date);
    	let rangeEnd = moment(date);
    	    	
    	switch (view) {
    		case 'month':
    			rangeStart.startOf('month').startOf('week');
    			rangeEnd.endOf('month').endOf('week');
    			break;
    		case 'week':
    			rangeStart.startOf('week');
    			rangeEnd.endOf('week');
    			break;
    		case 'day':
    			break;
    		case 'agenda':
    			rangeEnd.add(31, 'days');
    	}

    	loadEventsForDateRange(rangeStart, rangeEnd);
    }


    function loadEventsForDateRange(start, end){
    	console.log('Loading events: ' + start .format('MM/DD/YYYY') + '  - ' + end.format('MM/DD/YYYY'));
    	eventFactory.getEvents(start.toDate(), end.toDate())
                                .success(function(calendarEvents){
                                    calendarEvents.forEach((event) => {
                                        event.start = new Date(event.start);
                                        event.end = new Date(event.end);
                                        event.startDate = moment(event.start).format('MM/DD/YYYY');
                                        event.endDate = moment(event.end).format('MM/DD/YYYY');
                                        event.startTime = moment(event.start).format('hh:mma');
                                        event.endTime = moment(event.end).format('hh:mma');
                                    });

                                     vm.events = calendarEvents;
                                })
                                .error(function(err){
                                    console.log(err);
                                });
    }




    $rootScope.$on('WALL_NAV_CHANGED', function(event, criteria) {
			event.stopPropagation();
			$scope.$broadcast('WALL_NAV_CHANGED', criteria);
		});


});

