var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachmentSchema = require('./attachment').AttachmentSchema;

var RichTextSchema = new Schema({	

	type: { type: String, enum: ['Draft', 'Published']},
	author : {type:Schema.Types.ObjectId, ref: 'User', required: true},
	post: {type:Schema.Types.ObjectId, ref: 'Post'},
    files: [AttachmentSchema],
    text: String,
    title: String,
    previewImg: String,
    previewText: String,
    
	created_by: String,
	updated_by: String,
	created_at: Date,
  	updated_at: Date
});

RichTextSchema.pre('save', function(next) {
	var currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.created_at) {
		this.created_at = currentDate;
	}
	next();
});


var RichText = mongoose.model('RichText', RichTextSchema);
module.exports = {
  RichText : RichText,
  RichTextSchema: RichTextSchema
}