'use strict';

var moment = require('moment');

export default class CalendarEventBuilder {

	constructor(events) {
		this.events = events;
	}

	build() {
		return this.events.map((e) => {
			title: e.title,
			start: e.start,
			end: e.end,
			allDay: e.isAllday ? true : false
		});
	}
}