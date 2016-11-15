var mongoose = require('mongoose');
var Schedule = require('./event').Event
var SchoolUser = require('./schoolUser').SchoolUser
var Schema = mongoose.Schema;


var ClassUserSchema = new Schema({
  
  'class': {type:Schema.Types.ObjectId, ref: 'Class', required: true },
  user: {type:Schema.Types.ObjectId, ref: 'User'},

  status: { type: String, enum: ['active', 'suspended']} ,
  payment: { type: String, enum: ['pending', 'partial', 'completed']} ,
  type: { type: String, enum: ['teacher', 'student', 'parent', 'admin'], required: true} ,

  //Stage till user is created
  email: String,
  firstname: String,
  lastname: String,

  created_at: Date,
  updated_at: Date,
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