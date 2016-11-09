var mongoose = require('mongoose');
var User = require('./user').User
var Schema = mongoose.Schema;

var AttachmentSchema = new Schema({

  school: { type: Schema.Types.ObjectId, ref: 'School' },
  class: { type: Schema.Types.ObjectId, ref: 'Class' },
  fileid: {type:String},
  fileName: {type:String},
  size: Number,
  type: String,
  thumbnailid: {type:String},
  caption: String,
  dimensions: {
    height: Number,
    width: Number
  },
  created_by: { type: Schema.Types.ObjectId, ref: 'User' },
  created_at: { type: Date, default: Date.now },

});

// on every save, add the date
AttachmentSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;
  next();
});

var Attachment = mongoose.model('Attachment', AttachmentSchema);
module.exports = {
  Attachment: Attachment,
  AttachmentSchema: AttachmentSchema
};