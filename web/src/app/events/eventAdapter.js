var moment = require('moment');

var sampleEvent = 
{
	title: 'Introduction Functional Programming - session 1',
	details: 'Introduction Functional Programming - session 1',
	isAllday: true,
	startDate: "11/14/2016",
	startTime: '11:00 AM',
	endDate: "11/19/2016",
	endTime: '12:00 PM',
	repeat: {
		frequency: 'monthly',
		daily: {every: 1},
		weekly: { every: 1, days : ['monday'] },
		monthly: { every: 1, iseach: true, isonthe: false, days: [1, 10, 20], onThe: { seq: 'first', day: 'friday'}}
	}
}

var events = [
	{
		title: 'One on One w/ Ram',
		details: 'One on One w/ Ram',
		isAllday: false,
		start: moment().hour(10).minute(0).toDate(),
		end: moment().hour(11).minute(0).toDate(),
		repeat: {
			frequency: 'none'
		}
	},
	{
		title: 'Project demo f/ Ram',
		details: 'Project demo f/ Ram',
		isAllday: false,
		start: moment().hour(10).minute(0).toDate(),
		end: moment().hour(14).minute(0).toDate(),
		repeat: {
			frequency: 'none'
		}
	}
	
];


function covertToCalendarEvents(events) {

	var calendarEvents = [];

	events.map((e) => {
		return {
			title: e.title,
			allDay: e.isAllday,
			start: e.startDate,
			end: e.endDate,

		};
	});


}

