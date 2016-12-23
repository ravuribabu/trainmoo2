var mongoose = require('mongoose');
var Schedule = require('./event').Event
var SchoolUser = require('./schoolUser').SchoolUser
var Schema = mongoose.Schema;


var ClassUserSchema = new Schema({
  
  school: {type:Schema.Types.ObjectId, ref: 'School', required: true },
  'class': {type:Schema.Types.ObjectId, ref: 'Class' }, //If null => entitlement at school level
  schoolUser: {type:Schema.Types.ObjectId, ref: 'SchoolUser', required: true},

  status: { type: String, enum: ['active', 'suspended']} ,
  payment: { type: String, enum: ['pending', 'partial', 'completed']} ,

  created_at: Date,
  updated_at: Date

});

// on every save, add the date
ClassUserSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;

  next();

});

var ClassUser = mongoose.model('ClassUser', ClassUserSchema);
module.exports = {
  ClassUser: ClassUser,
  ClassUserSchema: ClassUserSchema
};