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

		this.eventStyleGetter = (event, start, end, isSelected) => {
		    var backgroundColor = event.color?event.color:'#62a8ea';
		    var style = {
		        backgroundColor: backgroundColor,
		        borderColor: backgroundColor,
		        borderRadius: '10px',
		        opacity: 0.6,
		        color: '#fff',
		        display: 'block',
		        fontSize: '.85em',
    			fontWeight: 300
		    };
		    return {
		        style: style
		    };
		}

	}


	render(){
		
		return (
				<div>
				    <BigCalendar
						selectable 
						popup
						events={this.props.events}
						defaultDate={new Date()}
						defaultView= {this.props.view}
						onSelectEvent={event => this.props.onSelectEvent({event: event})}
						onSelectSlot={(slotInfo) => this.props.onSelectSlot({slotInfo: slotInfo})}
						step={15}
         				timeslots={4}
        				onNavigate = { (date, view) => this.props.onNavigate({ date: date, view: view } ) } 
        				onView = { (v) =>  this.props.onView({view: v})  } 
        				eventPropGetter={this.eventStyleGetter}
				    />
				 </div>
			);
	}


	



}

