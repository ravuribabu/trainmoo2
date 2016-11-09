var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EventSchema = new Schema({
	class: {type: Schema.Types.ObjectId, ref: 'Class'},
	trainer : {type: Schema.Types.ObjectId, ref: 'User'},
	title: { type: String, required: true},
	details: { type: String, required: true},
	type: { type: String, required: true},
	eventTime: {
		start: { type: Date, required: true},
		end: { type: Date, required: true}
	},

	repeat: { type: Boolean, default: false},
	frequency:  {
			type: String,
			enum: ['daily', 'weekly', 'monthly', 'yearly']
		},
	eventDate: {
		start: Date, end: Date
	},
	days: [ {
			type: String,
			enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
		} ],
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