'use strict';

var moment = require('moment');


module.exports = 
{ 
	buildCalendarEvents : buildCalendarEvents ,
	calculatedEndDate: calculateEndDate
}

//Build calendar events
function buildCalendarEvents(events, start, end) {

 	if (!start) {
 		start = moment().startOf('month').toDate();
 	}
 	if (!end) {
 		end = moment().endOf('month').toDate();
 	}
	let calendarEvents = [];

	events.forEach((e) => {
		calendarEvents = calendarEvents.concat(buildCalendarEvent(e, start, end));
	});

	return calendarEvents;
}

function buildCalendarEvent(e, start, end) {


	switch (e.repeat) {
		case 'none':
			return buildSingleEvent(e);
		case 'daily':
			return buildDailyEvents(e, start, end);
		case 'weekly':
			return buildWeeklyEvents(e, start, end);
		case 'monthly':
			return buildMonthlyEvents(e, start, end);
		// case 'custom': 
		// 	return buildCustomEvent(e, rangeStart, rangeEnd);
	}
}

function buildSingleEvent(e, start, end) {

	let calendarEventEnd;

	console.log(e.isAllDay + ' - ' + e.start + ' - ' + e.end);
	if (e.isAllDay && moment(e.start).format('YYYY-MM-DD') === moment(e.end).format('YYYY-MM-DD')) {

		calendarEventEnd = moment(e.end).add(1, 'days').startOf('day').toDate();
		console.log('calendarEventEnd:', calendarEventEnd);
	} else {
		calendarEventEnd = e.end
	}

	return {
			title: e.title,
			start: e.start,
			end: calendarEventEnd,
			allDay: e.isAllDay ,
			event: e._id,
			color: e.color
		};
}


//Daily
function calculateDailyRange(e, start, end) {

	let rangeStart = moment(e.start);
	if (moment(start).diff(moment(e.start), 'days') > 0){
		rangeStart = moment(start);
	}

	let rangeEnd = moment(end);
	if (e.endRepeat === 'On Date' && moment(e.endOn).diff(moment(rangeEnd), 'days') < 0){
		rangeEnd = moment(e.endOn);
	}	

	if (e.endRepeat === 'After'){
		const every = e.daily.every; //TODO default to 1
		const eventEndDate = moment(e.start).add(e.endAfter * every - 1, 'days');
		if (eventEndDate.diff(rangeEnd) < 0) {
		  rangeEnd = eventEndDate;
		}
	}

	console.log('DAILY RANGE: ' + rangeStart.format('YYYY-MM-DD') + ' - ' + rangeEnd.format('YYYY-MM-DD'));
	return {rangeStart: moment(rangeStart), rangeEnd: moment(rangeEnd) } ;

}

function buildDailyEvents(e, start, end) {

	let calendarEvents  = [];
	const eventStart = moment(e.start);
	const eventEnd = moment(e.end);

	const {rangeStart, rangeEnd} = calculateDailyRange(e, start, end);

	const days = rangeEnd.diff(rangeStart, 'days') + 1;

	let currDate = rangeStart.clone();
	for (var i = 0 ; (i < days) ; i++) {
		if (currDate.diff(moment(e.start), 'days') % e.daily.every === 0 ) {

			let calendarEventEnd;
			if (e.isAllDay) {
				calendarEventEnd = currDate.clone().add(1, 'days').startOf('day').toDate();
			} else {
				calendarEventEnd = currDate.clone().hour(eventEnd.hour()).minute(eventEnd.minute()).toDate()
			}

			calendarEvents.push({
				title: e.title,
				start: currDate.clone().hour(eventStart.hour()).minute(eventStart.minute()).toDate(),
				end: calendarEventEnd,
				allDay: e.isAllDay,
				event: e._id,
				color: e.color

			});
		}
		currDate.add(1, 'days');
	}
	return calendarEvents;
}


//Weekly
function calculateWeeklyRange(e, start, end) {

	let rangeStart = moment(start);
	if (rangeStart.diff(moment(e.start), 'days') < 0){
		rangeStart = moment(e.start);
	}

	let rangeEnd = moment(end);
	if (e.endRepeat === 'On Date' && moment(e.endOn).diff(moment(rangeEnd), 'days') < 0){
		rangeEnd = moment(e.endOn);
	}	

	console.log('Weekly RANGE: ' + rangeStart.format('MM.DD.YYYY') + ' - ' + rangeEnd.format('MM.DD.YYYY'));
	return {rangeStart: rangeStart, rangeEnd: rangeEnd } ;

}


function buildWeeklyEvents(e, start, end) {

	let calendarEvents  = [];
	const eventStart = moment(e.start);
	const eventEnd = moment(e.end);

	if (!e.weekly ) {
		e.weekly = {
			every: 1,
			days: [moment(e.start).day()]
		};
	}

	const {rangeStart, rangeEnd} = calculateWeeklyRange(e, start, end);

	if (rangeEnd.diff(rangeStart, 'days') < 0) {
		return [];
	}

	calendarEvents = buildWeeklyEvents2(e, rangeStart, rangeEnd, e.endRepeat === 'After'?true:false);

	return calendarEvents;
}


function buildWeeklyEvents2(e, start, end, endAfter) {

	console.log('buildWeeklyEvents2:' + endAfter);
	let weeklyEvents = [];

	const eventStart = moment(e.start);
	const eventEnd = moment(e.end);

	let current;

	if (endAfter) {
		current = moment(e.start);
	} else {
		current = moment(start);
	}
	
	let noOfEvents = 0;
	let eventsToBeAdded = true;

	while (current.diff(end, 'days') <= 0 && eventsToBeAdded){

		if (noOfWeeksBetween(current, end) % e.weekly.every === 0){

			let days = e.weekly.days;
			
			console.log('DAYS: ' + days);

			const startOfWeek = current.clone().startOf('week');
			const currentEndOfWeek = current.clone().endOf('week');
	
			days.forEach((day) => {
				if ( day <= currentEndOfWeek.day() && eventsToBeAdded) {
					const currentEventStart = startOfWeek.clone().add(day, 'days');
					console.log('day: ' +  day +  'currentEventStart: ' + currentEventStart.format('MM.DD.YYYY'));
					
					if (currentEventStart.diff(moment(e.start), 'days') >= 0 
						&& currentEventStart.diff(moment(end, 'days')) <= 0){
						noOfEvents++;
						if (currentEventStart.diff(moment(start), 'days') >= 0){
								weeklyEvents.push({
									title: e.title,
									start: currentEventStart.clone().hour(eventStart.hour()).minute(eventStart.minute()).toDate(),
									end: currentEventStart.clone().hour(eventEnd.hour()).minute(eventEnd.minute()).toDate(),
									allDay: e.isAllDay ? true : false,
									event: e._id,
									color: e.color
								});
							}
						}
						console.log('noOfEvents:' + noOfEvents + ' e.monthly.endAfter:' + e.endAfter );
						if (endAfter && noOfEvents >= e.endAfter) {
							eventsToBeAdded = false;
						}
					}
			});
		}
		current.add(1, 'weeks').startOf('week').startOf('day');
	}
	
	return weeklyEvents;
}



function noOfWeeksBetween(start, end) {
	return ((start.week() - moment(end).week() + 53 )%53);
}



//Monthly
function calculateMonthlyRange(e, start, end) {

	let rangeStart = moment(start);
	if (rangeStart.diff(moment(e.start), 'days') < 0){
		rangeStart = moment(e.start);
	}

	let rangeEnd = moment(end);
	if (e.endRepeat === 'On Date' && moment(e.endOn).diff(moment(rangeEnd), 'days') < 0){
		rangeEnd = moment(e.endOn);
	}	

	console.log('Monthly RANGE: ' + rangeStart.format('MM.DD.YYYY') + ' - ' + rangeEnd.format('MM.DD.YYYY'));
	return {rangeStart: rangeStart, rangeEnd: rangeEnd } ;

}

function buildMonthlyEvents(e, start, end) {

	if (!e.monthly) {
		e.monthly = {
			every: 1,
			iseach: true,
			days: [moment(e.start.day())]
		};
	}

	const {rangeStart, rangeEnd} = calculateMonthlyRange(e, start, end);
	if (rangeEnd.diff(rangeStart, 'days') < 0) {
		return [];
	}

	console.log('e.endRepeat:' + e.endRepeat);

    return buildMonthlyEvents2(e, rangeStart, rangeEnd, e.endRepeat === 'After'?true:false);


}


function buildMonthlyEvents2(e, start, end, endAfter) {

	console.log('buildMonthlyEventsEndNever:' + endAfter);
	let monthlyEvents = [];

	const eventStart = moment(e.start);
	const eventEnd = moment(e.end);

	let current;

	if (endAfter) {
		current = moment(e.start);
	} else {
		current = moment(start);
	}
	
	let noOfEvents = 0;
	let eventsToBeAdded = true;

	while (current.diff(end, 'days') <= 0 && eventsToBeAdded){

		if (((current.month() - moment(e.start).month() + 12 )%12) % e.monthly.every === 0){

			let days = [] ;
			
			if (e.monthly.iseach) {
				days = e.monthly.iseach?e.monthly.days:[];
			} 
			else if (e.monthly.isonthe) {
				let ontheMonthDay = getMonthDay(e.monthly, current);
				days = e.monthly.isonthe?[ontheMonthDay.date()]:[];
			} else {
				days = [eventStart.date()];
			}
			
			console.log('DAYS: ' + days);

			const prevEndOfMonth = current.clone().startOf('month').subtract(1, 'days');
			const currentEndOfMonth = current.clone().endOf('month');
	
			days.forEach((day) => {
				if ( day <= currentEndOfMonth.date() && eventsToBeAdded) {
					const currentEventStart = prevEndOfMonth.clone().add(day, 'days');
					console.log('day: ' +  day +  'currentEventStart: ' + currentEventStart.format('MM.DD.YYYY'));
					
					if (currentEventStart.diff(moment(e.start), 'days') >= 0 
						&& currentEventStart.diff(moment(end, 'days')) <= 0){
						noOfEvents++;
						if (currentEventStart.diff(moment(start), 'days') >= 0){
								monthlyEvents.push({
									title: e.title,
									start: currentEventStart.clone().hour(eventStart.hour()).minute(eventStart.minute()).toDate(),
									end: currentEventStart.clone().hour(eventEnd.hour()).minute(eventEnd.minute()).toDate(),
									allDay: e.isAllDay ? true : false,
									event: e._id,
									color: e.color
								});
							}
						}
						console.log('noOfEvents:' + noOfEvents + ' e.monthly.endAfter:' + e.endAfter );
						if (endAfter && noOfEvents >= e.endAfter) {
							eventsToBeAdded = false;
						}
					}
			});
		}
		current.add(1, 'months').startOf('month').startOf('day');
	}
	
	return monthlyEvents;
}



function isWeekday(mdate) {
	const dayOfWeek = mdate.day();
	return (dayOfWeek != 0 && dayOfWeek != 6) ;
}

function isWeekend(mdate) {
	const dayOfWeek = mdate.day();
	return (dayOfWeek === 0 || dayOfWeek === 6) ;
}

//console.log(getMonthDay({ seq: 'first', day: 'friday'}, moment()));

function getMonthDay(monthly, date) {

	const seqNames = ['first', 'second', 'third', 'fourth', 'fifth'];
	const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']; //day, weekday, weekenday

	const { seq, day } = monthly;
	let onTheDay = moment(date);
	let seqIndex;
	let dayOfTheWeek;

	switch (seq) {
		case 'first':
		case 'second':
		case 'third':
		case 'fourth': 
		case 'fifth':
			seqIndex = seqNames.indexOf(seq);
			break;
		case 'last': 
			//depends on day selected. if sun - sat is selected, this will be 
			seqIndex = Math.ceil(onTheDay.clone().endOf('month').date()/7) + 1;
			break;
	}

	console.log('seq index: ' , seqIndex);

	switch (day) {
		case 'sunday':
		case 'monday':
		case 'tuesday':
		case 'wednesday':
		case 'thursday':
		case 'friday':
		case 'saturday':
			dayOfTheWeek = days.indexOf(day) + 1;

			switch (seq) {
				case 'last':
					onTheDay.endOf('month');
					const lastDayOfTheMonth = onTheDay.day() + 1;
					onTheDay.subtract( ((lastDayOfTheMonth - dayOfTheWeek + 7) % 7) , 'days');
					break;
				default:
					
					onTheDay.startOf('month');
					const firstDayOfTheMonth = onTheDay.day() + 1;
					onTheDay.add( ((dayOfTheWeek - firstDayOfTheMonth + 7) % 7) , 'days').add(seqIndex, 'weeks');
					break;
				};
			break;
		case 'day': 
			switch (seq) {
				case 'last':
					onTheDay.endOf('month').startOf('day');
					break;
				default:
					onTheDay.startOf('month').add(seqIndex, 'days');
					break;
			};
			break;
		case 'weekday':
			switch (seq) {
				case 'last':
					onTheDay.endOf('month').startOf('day');
					while (!isWeekday(onTheDay)) {
						onTheDay.subtract(1, 'days');
					}
					break;
				default: // first, second, third, fourth, fifth
					onTheDay.startOf('month').startOf('day').subtract(1, 'days');
					let count = 0;
					while (count <= seqIndex) {
						onTheDay.add(1, 'days');
						if (isWeekday(onTheDay)) {
							count++;
						}
					}
					break;
			};
			break;

		case 'weekendday':
			switch (seq) {
				case 'last':
						onTheDay.endOf('month').startOf('day');
						while (!isWeekend(onTheDay)) {
							onTheDay.subtract(1, 'days');
						}
						break;
				default: // first, second, third, fourth, fifth
						{
							onTheDay.startOf('month').startOf('day').subtract(1, 'days');
							let count = 0;
							while (count <= seqIndex) {
								onTheDay.add(1, 'days');
								if (isWeekend(onTheDay)) {
									count++;
								}
							}
							break;
						}
	};
			break;
	}

	return onTheDay;
}



//Calculate end date for the event
function calculateEndDate(e) {
	console.log(e.repeat);

	switch (e.repeat) {
		case 'none':
			return e.end;
		case 'daily':
			return getDailyEndEvent(e);
		case 'weekly':
			return getWeeklyEndEvent(e);
		case 'monthly':
		console.log('calling monthly');
			return getMonthlyEndEvent(e);
	}
}

function getDailyEndEvent(e){
	switch (e.endRepeat) {
		case 'Never':
			return moment('9999-12-01').toDate();
		case 'After':
			return moment(e.start).add(e.endAfter * e.daily.every, 'days').toDate();
			break;
		case 'End On':
			return e.endOn;
	}	
}

function getWeeklyEndEvent(e) {

	

	switch (e.endRepeat) {
		case 'Never':
			return moment('9999-12-01').toDate();
		case 'After':
			{
				let startOfTheWeek = moment(e.start);
				let noOfEvents = 0;
				while (noOfEvents < e.endAfter && startOfTheWeek.diff(moment(e.start), 'weeks')%e.weekly.every === 0) {
					let startDate = startOfTheWeek.day();
					e.weekly.days.forEach((day) => {
						if (day >= startDate) {
							noOfEvents++;
						}
					});
					startOfTheWeek.add(1, 'weeks').startOf('week');
				}
				return startOfTheWeek.subtract(1, 'days').toDate();
			}


			return moment(e.start).add( (e.endAfter * e.weekly.every )/ e.weekly.days.length , 'weeks').toDate();
			break;
		case 'End On':
			return e.endOn;
	}	
}


function getMonthlyEndEvent(e) {

	console.log('e.endRepeat: ' + e.endRepeat);
	switch (e.endRepeat) {
		case 'Never':
			return moment('9999-12-01').toDate();
		case 'After': 
		return moment('9999-12-01').toDate();
			// {
			// 	let startOfTheMonth = moment(e.start).startOf('month');
			// 	let noOfEvents = 0;
			// 	let startDate = moment(e.start).date();
			// 	let endDate = startOfTheMonth.clone().endOf('month').date();

			// 	while (noOfEvents < e.endAfter && startOfTheMonth.diff(moment(e.start), 'months')%e.monthly.every === 0) {
			// 		console.log('NoOfEvents: ' + noOfEvents + ' - ' + startOfTheMonth.diff(moment(e.start), 'months'))
			// 		if (e.monthly.iseach){
			// 			e.monthly.days.forEach((day) => {
			// 				if (day >= startDate && day <= endDate) {
			// 					noOfEvents++;
			// 				}
			// 			});
			// 		} else if (e.monthly.isonthe) {
			// 			let dayOfTheMonth = getMonthDay(e.monthly, startOfTheMonth).date();
			// 			console.log('dayOfTheMonth: ' +dayOfTheMonth);
			// 			if (dayOfTheMonth >= startDate && dayOfTheMonth <= endDate) {
			// 				noOfEvents++;
			// 			}
			// 		}

			// 		startOfTheMonth.add(1, 'months').startOf('month');
			// 		startDate = 1;
			// 		endDate = startOfTheMonth.clone().endOf('month').date();
			// 	}

			// 	return startOfTheMonth.toDate();
			// }

			break;
		case 'End On':
			return e.endOn;
	}	
}
