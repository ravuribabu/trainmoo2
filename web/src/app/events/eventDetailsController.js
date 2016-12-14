'use strict';


const events = angular.module('events');

events.controller('eventDetailsController', ['$scope', '$uibModalInstance', 'eventFactory', 'params', 'alertify', 'appForm', function($scope, $uibModalInstance, eventFactory, params, alertify, appForm){
  

	const _ = require('lodash');

	let vm = this;
	let moment = require('moment');
	vm.eventid = params.calendarEvent.event;
	vm.calendarEvent = params.calendarEvent;
	console.log('Loading event: ' + vm.eventid);

	init()

	function init(){

		if (vm.eventid){
			eventFactory.getEvent(vm.eventid)
						.success(function(event){
							event.start = new Date(event.start);
                            event.end = new Date(event.end);
                            event.startDate = moment(event.start).format('MM/DD/YYYY');
                            event.endDate = moment(event.end).format('MM/DD/YYYY');
                            event.startTime = moment(event.start).format('hh:mma');
                            event.endTime = moment(event.end).format('hh:mma');
                            event.endOn = new Date(event.endOn);
                            vm.event = event;

                            vm.eventDiff = moment(event.end).diff(moment(event.start), 'days');
							vm.eventTimeDiff = moment(event.end).diff(moment(event.start), 'minutes');

						})
						.error(function(err){
							console.log(err);
						})
		}
		else {
			vm.event = vm.calendarEvent;
			vm.event.startDate = moment(vm.event.start).format('MM/DD/YYYY');
            vm.event.endDate = moment(vm.event.end).format('MM/DD/YYYY');
            vm.event.startTime = moment(vm.event.start).format('hh:mma');
            vm.event.endTime = moment(vm.event.end).format('hh:mma');

            vm.eventDiff = moment(vm.event.end).diff(moment(vm.event.start), 'days');
			vm.eventTimeDiff = moment(vm.event.end).diff(moment(vm.event.start), 'minutes');
		}

		vm.form = new appForm.AppForm(angular, function(form){

	        if (vm.event._id) {
	           vm.update();
	        }
	        else {
	           vm.create();
	        } 
	       
	       // $scope.Form.$setPristine(true);

	      }, function() {} );


	}


	vm.update = function() {
    	
    	const eventStartTime = moment(vm.event.startTime, 'hh:mma');
		const eventEndTime = moment(vm.event.endTime, 'hh:mma');
		vm.event.start = moment(vm.event.startDate, 'MM/DD/YYYY').hour(eventStartTime.hour()).minute(eventStartTime.minute()).toDate();
		vm.event.end = moment(vm.event.endDate, 'MM/DD/YYYY').hour(eventEndTime.hour()).minute(eventEndTime.minute()).toDate();

    	eventFactory.updateEvent(vm.event._id, vm.event)
    				.success(function(msg) {
    					console.log(msg);
    					vm.ok();
    				})
    				.error(function(err){
    					console.log(err);
    				})
    }

	vm.create = function() {
		const eventStartTime = moment(vm.event.startTime, 'hh:mma');
		const eventEndTime = moment(vm.event.endTime, 'hh:mma');
		vm.event.start = moment(vm.event.startDate, 'MM/DD/YYYY').hour(eventStartTime.hour()).minute(eventStartTime.minute()).toDate();
		vm.event.end = moment(vm.event.endDate, 'MM/DD/YYYY').hour(eventEndTime.hour()).minute(eventEndTime.minute()).toDate();
		console.log(vm.event);
		eventFactory.saveOrUpdateEvent(vm.event);
		vm.repeatText = getRepeatText(vm.event);
		vm.ok();
	}

	

	// vm.event = {
	// 	title: 'Introduction Functional Programming - session 1',
	// 	details: 'Introduction Functional Programming - session 1',
	// 	isAllDay: false,
	// 	start: moment().hour(10).minute(0).toDate(),
	// 	end: moment().hour(10).minute(0).toDate(),
	// 	repeat: 'none',
	// 	isCustom: false,
	// 	// daily: {every: 1},
	// 	// weekly: { every: 1, days : [1, 2] },
	// 	// monthly: { every: 1, iseach: true, isonthe: false, days: [1, 10, 20], seq: 'first', day: 'friday'},
	// 	// endRepeat: 'After',
	// 	// endAfter: 10,
	// 	// endOn: moment().add(5, 'months')
	// };


	//vm.repeatText = getRepeatText(vm.event);
	
	function getRepeatText(event) {

		let text = "";

		if (!event.repeat) return text;

		switch (event.repeat) {
			case 'none':
				text = "";
				break;
			case 'daily' : {
								const {every} = event.daily;
								text = every === 1 ? 'Every Day' : 'Every ' +  every + ' Days';
								break;
							}
			case 'weekly':{
							const { every, days }  = event.weekly;
						    text = every > 1 ? 'Every ' + every + ' Weeks' : ' Every Week'
							if (days.length > 0) {
								text = text + ' on '+ _.join(days, ', ') ;
							} 
							break;
						}
			case 'monthly':{
							const {every, iseach, isonthe, days, seq, day } = event.monthly;
							const prefix = every > 1 ? 'Every ' + every + ' Months on ' : ' Every Month on '
			
							if (iseach) {
								text = prefix + joinWithOrdinalSuffixes(days, ', ') + (days.length > 1 ? 'days' : 'day');
							} else {
								text = prefix + seq + ' ' + day + ' .';
							}
							break;
						}
		}

		return text;

	}

	function joinWithOrdinalSuffixes(arr) {

		if (!arr || arr.length <= 0) return;

		return arr
				.map((a) => { return ordinal_suffix_of(a)} )
				.reduce((s, elm, index, arr) => {
					let sep = ', ' ;
					if (index === arr.length - 1) sep = ' ';
					if (index === arr.length - 2) sep = ' and '
					return s + elm + sep ;
				}, '');
	}

	function ordinal_suffix_of(i) {
	    var j = i % 10,
	        k = i % 100;
	    if (j == 1 && k != 11) {
	        return i + "st";
	    }
	    if (j == 2 && k != 12) {
	        return i + "nd";
	    }
	    if (j == 3 && k != 13) {
	        return i + "rd";
	    }
	    return i + "th";
	}

	vm.setAllday = (allday) => {
		if (allday) {
			vm.event.startTime = '12:00am';
			vm.event.endTime = '12:00am';
		}
	}

	vm.selectMonthlyEach = () => {

		vm.event.monthly.iseach = true;
		vm.event.monthly.isonthe = false;
		vm.event.monthly.seq = undefined;
		vm.event.monthly.day = undefined;
	    vm.event.monthly.days = [];

	}

	vm.selectMonthlyOnthe = () => {
		vm.event.monthly.iseach = false;
		vm.event.monthly.isonthe = true;
	    vm.event.monthly.days = [] ;
	}

	vm.isWeekDaySelected = (day) => {
		return vm.event.weekly.days.indexOf(day) >= 0 
	}

	vm.monthly = {};
	vm.monthly.seq = ['first', 'second', 'third', 'fourth', 'fifth', 'last'];
	vm.monthly.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'day', 'weekday', 'weekendday'];

	vm.selectWeekDay = (day) => {

		if (vm.event.weekly.days.indexOf(day) >= 0) {
			vm.event.weekly.days = vm.event.weekly.days.filter((e)=> e != day);
		} else {
			vm.event.weekly.days.push(day);
		}

	}

	vm.isMonthDaySelected = (day) => {
		return vm.event.monthly.days.indexOf(day) >= 0 
	}

	vm.selectMonthDay = (day) => {
		if (vm.event.monthly.days.indexOf(day) >= 0) {
			vm.event.monthly.days = vm.event.monthly.days.filter((e)=> e != day);
		} else {
			vm.event.monthly.days.push(day);
		}
	}

	vm.onStartDateChange = () => {
		let start = moment(vm.event.startDate);
		if (vm.event.endDate) {
			vm.event.endDate = start.add(vm.eventDiff, 'days').format('MM/DD/YYYY');
		} else {
			vm.event.endDate = vm.event.startDate;
		} 
	}

	vm.onStartTimeChange = () => {
		let start = moment(vm.event.startTime, 'hh:mma');
		if (vm.event.endTime) {
			vm.event.endTime = start.add(vm.eventTimeDiff, 'minutes').format('hh:mma');
		} else {
			vm.event.endTime = vm.event.startTime;
		} 
	}

	vm.onEndDateChange = () => {
		let end = moment(vm.event.endDate);
		if (vm.event.startDate) {
			if (moment(vm.event.startDate).diff(end, 'days') > 0) {
				vm.event.startDate = vm.event.endDate;
			}
		} else {
			vm.event.startDate = vm.event.endDate;
		} 
		vm.eventDiff = moment(vm.event.endDate).diff(moment(vm.event.startDate), 'days');
	}

	vm.onEndTimeChange = () => {
		let end = moment(vm.event.endTime, 'hh:mma');
		if (vm.event.startTime) {
			if (moment(vm.event.startTime, 'hh:mma').diff(end, 'minutes') > 0) {
				vm.event.startTime = vm.event.endTime;
			}
		} else {
			vm.event.startTime = vm.event.endTime;
		} 
		vm.eventTimeDiff = moment(vm.event.endTime, 'hh:mma').diff(moment(vm.event.startTime, 'hh:mma'), 'minutes');
		console.log('vm.eventTimeDiff' + vm.eventTimeDiff);
	}

	vm.setEndRepeat = (endRepeat) => {
		vm.event.endRepeat = endRepeat;

		switch (endRepeat) {
			case 'Never': 
				delete vm.event.endAfter;
				delete vm.event.endOn;
				break;
			case 'After':
				delete vm.event.endOn;
				break;
			case 'On The': 
				delete vm.event.endAfter;
				break;
		}
	}

	vm.setFrequency = function(repeat) {
		if (vm.repeat === repeat) {
			return;
		}

		vm.repeatText = "";
		vm.event.repeat = repeat;
		switch (repeat) {
			case 'none':
				delete vm.event.isCustom;
				break;
			case 'daily' : 
				vm.event.daily = {every: 1},
				vm.event.endRepeat = 'Never';
				delete vm.event.weekly;
				delete vm.event.monthly;
				break;
			case 'weekly':
				vm.event.weekly = { every: 1, days : [] },
				vm.event.endRepeat = 'Never';
				delete vm.event.daily;
				delete vm.event.monthly;
				break;
			case 'monthly':
				delete vm.event.daily;
				delete vm.event.weekly;
				vm.event.endRepeat = 'Never';
				vm.event.isCustom = false;
				vm.event.monthly = { every: 1, iseach: false, isonthe: false, days: []}
				break;
		}
	}

	vm.selectCustom = function(){
		if (!vm.event.isCustom) {
			vm.event.monthly = { every: 1, iseach: false, isonthe: false, days: []}
		} 
	}
	
    vm.delete = function() {
    	eventFactory.deleteEvent(vm.event._id)
    				.success(function(msg) {
    					console.log(msg);
    				})
    				.error(function(err){
    					console.log(err);
    				});
    	vm.ok();
    }




	vm.ok = function () {
		$uibModalInstance.close(vm.event);
	};

	vm.cancel = function () {
		$uibModalInstance.dismiss('cancel');
	};



	vm.monthDays = new Array(31);
	vm.showAttachments = true;



	$scope.$watch('vm.event.startDate', function(newValue, oldValue){
		console.log('New Value: ' + newValue + ' Old Value: ' + oldValue);
	});


	$scope.mytime = new Date();

	$scope.hstep = 1;
	$scope.mstep = 15;

	$scope.options = {
		hstep: [1, 2, 3],
		mstep: [1, 5, 10, 15, 25, 30]
	};

	$scope.ismeridian = true;

	$scope.freq = 'none';

	
}]);