var mongoose = require('mongoose');
var Schedule = require('./event').Event;
var User = require('./user').User;
var User = require('./school').School;
var AttachmentSchema = require('./attachment').AttachmentSchema;


var Schema = mongoose.Schema;

//ClassSchema will be used for programs and classes
//For Programs programid will be blank
var ClassSchema = new Schema({
  
  //programid to which class belings to 
  //If blank implies current entity represents a program
  program: {type: Schema.Types.ObjectId, ref: 'Class'} ,
  school:  {type: Schema.Types.ObjectId, ref: 'School'} ,
  name: { type: String, required: true },
  profile: String,
  address: String, 
  placeid: String, 
  categories: [String],
  medium: [String],
  phone: String,
  website: String,
  contacts: [{ user: { type: Schema.Types.ObjectId, ref: 'User' },
               role: String,
               order : Number }],

  gallery: [AttachmentSchema],
  attachments: [AttachmentSchema],
  sections: [{
    title: String, summary: String, seq: Number
  }],

  status: String,
  capacity: String,
  cost: Number,
  start: Date,
  end: Date,
  noOfSessions: Number,
  created_at: Date,
  updated_at: Date

});

// on every save, add the date
ClassSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

var Class = mongoose.model('Class', ClassSchema);

module.exports = {
  Class: Class,
  ClassSchema: ClassSchema
};