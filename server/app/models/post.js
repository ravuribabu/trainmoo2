var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachmentSchema = require('./attachment').AttachmentSchema;

var PostSchema = new Schema({	

	type: { type: String, enum: ['Discussion', 'Message' , 'Assignment', 'Notification', 'Blog', 'Material', 'Newsletter', 'Task']},
	author : {type:Schema.Types.ObjectId, ref: 'User'},
	classes : [{
		id: {type:Schema.Types.ObjectId, ref: 'Class'},
		name: String
	}],
	parent: {type:Schema.Types.ObjectId, ref: 'Post'},
    files: [AttachmentSchema],
	dueby : {type:Date},
	text: String, 
	section: String,
	likes: Number,
	replies: Number,

	created_by: String,
	updated_by: String,
	created_at: Date,
  	updated_at: Date
});

PostSchema.pre('save', function(next) {
	console.log('Saving post text: ' + this.text);
	var currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.created_at) {
		this.created_at = currentDate;
	}
	next();
});


var Post = mongoose.model('Post', PostSchema);
module.exports = {
  Post : Post,
  PostSchema: PostSchema
}