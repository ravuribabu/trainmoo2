var mongoose = require('mongoose');
var User = require('./user').User
var AttachmentSchema = require('./attachment').AttachmentSchema;

var Schema = mongoose.Schema;

var SchoolSchema = new Schema({
  
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

  avatar: [AttachmentSchema],
  gallery: [AttachmentSchema],
  attachments: [AttachmentSchema],

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  updated_by: { type: Schema.Types.ObjectId, ref: 'User' }
});

// on every save, add the date
SchoolSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

var School = mongoose.model('School', SchoolSchema);
module.exports = {
  School: School,
  SchoolSchema: SchoolSchema
};