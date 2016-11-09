"use strict";
var Event = require('../models/event').Event;

module.exports = function(router) {
	
	router.route('/class/:classid/events')
			.post(function(req, res){
				var eventJson = req.body;
				Event.create(eventJson, function(err, event){
					if (err) { 
						console.log('Could not create event: ' + err);
						res.status(500).send(err);
					}
					else { 
						res.send({message: 'Event is Created Successfully'}); 
					}
				}); 
			})
			.get(function(req, res) {

				console.log('GET events for class: ' + req.params.classid);
			  	Event.find( { class : req.params.classid } )
				  	.populate('class')
				  	.populate('trainer')
				  	.exec(function(err, events){
				  		if (err) {
				  			console.log('error ' + err);
				  			res.send(err);
				  		} else {
				  			console.log('events retrieved: ' + events);
				  			res.json(events);
				  		}
				  	});

			  });


	router.route('/event/:eventid')
		  .put(function(req, res){
		  	Event.findById( req.params.eventid, function(err, event){
		  		if (err) {
		  			console.log('Could not find event : ' + req.params.eventid);
		  			res.send(err);
		  		}
		  		else {

		  			var newEvent = req.body;

		  			event.title = newEvent.title;
		  			event.trainer = newEvent.trainer;
		  			event.class = newEvent.class;
		  			event.details = newEvent.details;
		  			event.type = newEvent.type;
		  			event.eventTime = newEvent.eventTime;
		  			event.eventDate = newEvent.eventDate;
		  			event.repeat = newEvent.repeat;
		  			event.frequency = newEvent.frequency;
		  			event.days = newEvent.days;

		  			event.save(function(err, e) {
		  				if (err) {
		  					console.log('Failed tp update event');
		  					res.send(err);
		  				}else {
		  					res.json('Event updated Successfully');
		  				}
		  			});

		  			
		  		}
		  	});
		  })
		  .get(function(req, res) {
		  	Event.findById( req.params.eventid , function(err, event) {
		  		if (err) {
		  			console.log('Could not find event : ' + req.params.eventid);
		  			res.send(err);
		  		}
		  		else {
		  			console.log(event);
		  			res.json(event);
		  		}
		  	});
		  })
		  .delete(function(req, res) {
		  	Event.remove( { _id: req.params.eventid } , function(err) {
		  		if (err) {
		  			console.log('Could not find event : ' + req.params.eventid);
		  			res.send(err);
		  		}
		  	});
		  })
		  ;		
};