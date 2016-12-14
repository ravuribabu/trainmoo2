'use strict';

var events = require('angular').module('events');
var moment = require('moment');
var _ = require('lodash');

events.factory('eventFactory', function($http){
	return {
		getEvents: function(start, end ) {
			return $http.get('api/calendarEvents?start=' + moment(start).format('YYYY-MM-DD') + '&end=' + moment(end).format('YYYY-MM-DD')  );
		},

		saveOrUpdateEvent: function(event) {
			return $http.post('api/events', event);
			//console.log('Saving event: ' + event);
		},

		getEvent: function(eventid) {
			return $http.get('api/event/' + eventid);
		},

		getSchedule: function(classid) {
			return $http.get('api/schedule/' + classid);
		},

		deleteEvent: function(eventid) {
			return $http.delete('api/event/' + eventid);
		},

		updateEvent: function(eventid, event) {
			return $http.put('api/event/' + eventid, event);
		},
		getRepeatText: function(event) {

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
									text = prefix + this.joinWithOrdinalSuffixes(days, ', ') + (days.length > 1 ? 'days' : 'day');
								} else {
									text = prefix + seq + ' ' + day + ' .';
								}
								break;
							}
			}

			return text;

		},

		joinWithOrdinalSuffixes: function (arr) {

			if (!arr || arr.length <= 0) return;

			return arr
					.map((a) => { return this.ordinal_suffix_of(a)} )
					.reduce((s, elm, index, arr) => {
						let sep = ', ' ;
						if (index === arr.length - 1) sep = ' ';
						if (index === arr.length - 2) sep = ' and '
						return s + elm + sep ;
					}, '');
		},

		ordinal_suffix_of: function(i) {
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







	};
});


