mongoose = require('mongoose');
var User = require('./user').User
var School = require('./school').School
var Schema = mongoose.Schema;

//a persistent copy is not needed.
//this data can be derived from user - class - classuser

var SchoolUserSchema = new Schema({
  
  school: {type:Schema.Types.ObjectId, ref: 'School', required: true },
  user: {type:Schema.Types.ObjectId, ref: 'User'},
  
  status: { type: String, enum: ['active', 'suspended']} ,
  payment: { type: String, enum: ['pending', 'partial', 'completed']} ,
  type: { type: String, enum: ['teacher', 'student', 'parent', 'admin'], required: true} ,
  created_at: Date,
  updated_at: Date,

  //Stage till user is created
  email: String,
  firstname: String,
  lastname: String

});

// on every save, add the date
SchoolUserSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;

  next();

});

var SchoolUser = mongoose.model('SchoolUser', SchoolUserSchema);
module.exports = {
  SchoolUser: SchoolUser,
  SchoolUserSchema: SchoolUserSchema
};