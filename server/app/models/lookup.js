var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LookupSchema = new Schema({
  group: {type: String, required: true},
  value: {type: String, required: true},
  key: {type: String, required: true},
  description: {type: String, required: true},

  created_at: Date,
  updated_at: Date
});

// on every save, add the date
LookupSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

var Lookup = mongoose.model('Lookup', LookupSchema);
module.exports = {
  Lookup: Lookup,
  LookupSchema: LookupSchema
};