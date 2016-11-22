import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer


export default class Calendar extends React.Component {

	constructor(props) {
		super(props);
	}

	render(){
		const myEventsList = [ {
				    'title': 'All Day Event',
				    'allDay': true,
				    'start': new Date(2016, 11, 19),
				    'end': new Date(2016, 11, 19)
				  },
				  {
				    'title': 'Long Event',
				    'start': new Date(2016, 11, 19),
				    'end': new Date(2016, 11, 21)
				  }];

		return (
				<div>
				    <BigCalendar
				      events={myEventsList}
				      startAccessor='startDate'
				      endAccessor='endDate'
				    />
				  </div>
			);
	}
}
