"use strict";

var Event = require('../models/event').Event;
var {buildCalendarEvents, calculatedEndDate} = require('./calendarEventBuilder');
var moment = require('moment');


module.exports = function(router) {



	router.route('/schedule/:classid')
			.get(function(req, res){

				console.log('GetSchedule: ' + req.params.classid);

				Event.find({class: req.params.classid, type: 'schedule'})
						.exec(function(err, events){
							if (err) {
								res.status(500).send(err);
							} else {

								if (events && events.length>0) {
									res.send(events[0]);
								} else {

									let newEvent = {
										class: req.params.classid,
										type: 'schedule',
										title: 'Class Schedule',
										details: 'Class Details',
							            'start': moment().toDate(),
							            'end': moment().toDate(),
							            event: undefined,
							            isAllDay: false,
							            isCustom: false,
							            repeat: 'none',
									}

									Event.create(newEvent, function(err, event){
										if (err) { 
											console.log('Could not create event: ' + err);
											res.status(500).send(err);
										}
										else { 
											event.repeatText = getRepeatText(event);
											res.send(event); 
										}
									}); 
								}
							}
						})
			});


	router.route('/events')
		  .post(function(req, res) {

		  	var event = req.body;
		  	if (event.repeat === 'weekly' && (!event.weekly || event.weekly.days.length <= 0)) {
				event.weekly = {
					every: 1,
					days: [moment(event.start).day()]
				};
			}

			// if (event.repeat === 'monthly' && (!event.monthly || event.monthly.days.length <= 0)) {
			// 	event.monthly = {
			// 		every: 1,
			// 		days: [moment(event.start).date()]
			// 	};
			// }

			console.log("Event1: " + JSON.stringify(event, null, 4));
		  	event.calculatedEndDate = calculatedEndDate(event);
		  	console.log("Event2: " + JSON.stringify(event, null, 4));

		  	Event.create(event, function(err, event){
					if (err) { 
						console.log('Could not create event: ' + err);
						res.status(500).send(err);
					}
					else { 
						res.send(event); 
					}
				}); 
		});

	router.route('/event/:eventid')
	  .get(function(req, res) {

	  	const eventid = req.params.eventid;

	  	Event.findById(eventid)
	  			.exec(function(err, event){
		  			if (err) { 
							console.log('Could not get event: ' + err);
							res.status(500).send(err);
						}
						else { 
							console.log(JSON.stringify(event));
							res.send(event); 
						}
	  			})

	  }).put(function(req, res) {

	  	const eventid = req.params.eventid;
	  	var eventReq = req.body;

	  	var event = req.body;
	  	if (event.repeat === 'weekly' && (!event.weekly || event.weekly.days.length <= 0)) {
			event.weekly = {
				every: 1,
				days: [moment(event.start).day()]
			};
		}


		// if (event.repeat === 'monthly' && (!event.monthly || event.monthly.days.length <= 0)) {
		// 	event.monthly = {
		// 		every: 1,
		// 		days: [moment(event.start).date()]
		// 	};
		// }

		eventReq.calculatedEndDate = calculatedEndDate(eventReq);

	  	Event.findById(eventid)
	  			.exec(function(err, event){
		  			if (err) { 
							console.log('Could not get event: ' + err);
							res.status(500).send(err);
						}
						else { 

							Object.assign(event, eventReq);

							console.log('EVENT Req: ' + eventReq);	
							event.save(function(err, e){
								if (err) {
									console.log('Could not get event: ' + err);
									res.status(500).send(err);
								} else {
									res.send(e); 
								}
							});
						}
	  			})

	  }).delete(function(req, res) {


	  	const eventid = req.params.eventid;

	  	Event.findById(eventid)
	  			.remove()
	  			.exec(function(err, event){
		  			if (err) { 
							console.log('Could not get event: ' + err);
							res.status(500).send(err);
						}
						else { 
							res.send({message: 'Removed successfully'}); 
						}
	  			})

	  });


	router.route('/calendarEvents')
		 	.get(function(req, res) {
		 		
		 		const start = req.query.start? moment(req.query.start, 'YYYY-MM-DD').toDate(): moment().startOf('month').toDate();
	  			const end = req.query.end? moment(req.query.end, 'YYYY-MM-DD').toDate(): moment().endOf('month').toDate();

	  			console.log('START: ' + start + ' END: ' + end);

		 		Event.find({}, function(err, events){
		 			if (err) {
		 				console.log('Could not create event: ' + err);
						res.status(500).send(err);
		 			} else {
		 				let calendarEvents = buildCalendarEvents(events, start, end);
		 				res.send(calendarEvents); 
		 			}
		 		});
		 	});



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



};