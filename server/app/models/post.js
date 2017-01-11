var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachmentSchema = require('./attachment').AttachmentSchema;

var PostSchema = new Schema({	

	type: { type: String, enum: ['Discussion', 'Message' , 'Assignment', 'Notification', 'Blog', 'Material', 'Newsletter', 'Task', 'Assessment']},
	author : {type:Schema.Types.ObjectId, ref: 'User', required: true},
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
	replies: [ { type:Schema.Types.ObjectId, ref: 'Post' } ],
	

	//assignment, task, polls, assessments - tasks that need response from students
	//responses can be viewed by trainer only
	submittable: Boolean,
	//for private messages - default trainers can view all messages
	//no need to includes trainers and admins in this list
	users: [{type:Schema.Types.ObjectId, ref: 'User'}] ,
	responseType: { type: String, enum: ['submission', 'reply']},

	//Rich text preview 
	richtext: {
		id: {type:Schema.Types.ObjectId, ref: 'RichText'},
		previewImg: String,
	    previewText: String,
	    title: String
	},

	// avg score - stats for teachers etc 
	assessment: {
		title: String,
		description: String,
		duration: Number,
		count: Number,
		tf: Number, 
		mc: Number, 
		sa: Number,
	},
	
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

	if (['Assignment', 'Task', 'Poll', 'Assessment'].indexOf(this.type) >= 0) {
		this.submittable = true;
	}

	if (!this.responseType && this.parent) {
		this.responseType = 'reply';
	}

	next();
});


var Post = mongoose.model('Post', PostSchema);
module.exports = {
  Post : Post,
  PostSchema: PostSchema
}