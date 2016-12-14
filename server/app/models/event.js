var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachmentSchema = require('./attachment').AttachmentSchema;
var moment = require('moment');

var EventSchema = new Schema({
	
	school:  {type: Schema.Types.ObjectId, ref: 'School'},
	class: {type: Schema.Types.ObjectId, ref: 'Class'},
	users : [{type: Schema.Types.ObjectId, ref: 'User'}],

	title: { type: String, required: true},
	details: { type: String, required: true},
	type: { type: String, enum: ['schedule', 'event', 'other']},
	isAllDay: { type: Boolean, default: false },
	start: Date,
	end: Date,
	calculatedEndDate: Date,
	color: String,

	repeat: {type:String, enum: ['none', 'daily', 'weekly', 'monthly'], default: 'none'},
	isCustom: { type: Boolean, default: false },
	daily: {
			every: Number
		},
	weekly: {
		every: Number,
		days: [Number],
	},
	monthly: {
		every: Number,
		iseach: Boolean,
		isonthe: Boolean,
		days: [Number],
		seq: {type:String, enum:['first', 'second', 'third', 'fourth', 'fifth', 'last']},
		day : {
				type: String,
				enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'day', 'weekday', 'weekendday']
			  } 
	},
	endRepeat: { type: String, enum: ['Never', 'After', 'On Date']},
	endAfter: Number,
	endOn: Date,
	attachments: [AttachmentSchema],


	created_at: Date,
    updated_at: Date
});


EventSchema.virtual('eventid').get(function(){
	return this._id;
});


// on every save, add the date
EventSchema.pre('save', function(next) {

  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;

  next();

});


module.exports = { 
	Event: mongoose.model('Event', EventSchema),
	EventSchema: EventSchema
};