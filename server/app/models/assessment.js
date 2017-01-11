var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var AttachmentSchema = require('./attachment').AttachmentSchema;

var AssessmentSchema = new Schema({	

	//TF - True False, SA - Simple Answer, MC - Multi Choiceq
	post : {type:Schema.Types.ObjectId, ref: 'Post', required: false},
	seqno: Number,
	type: { type: String, enum: ['TF', 'SA', 'MC']}, 
	question: String,
	answer: String,
	isSingeOption: Boolean,
	options: [{
		seqno: String,
		text: String,
		file: AttachmentSchema,
		answer: Boolean
	}],
	explanation: String,
	difficulty: { type: String, enum: ['S', 'M', 'L']},

	created_by: String,
	updated_by: String,
	created_at: Date,
  	updated_at: Date

});

AssessmentSchema.pre('save', function(next) {

	var currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.created_at) {
		this.created_at = currentDate;
	}

	next();
});


var Assessment = mongoose.model('Assessment', AssessmentSchema);
module.exports = {
  Assessment : Assessment,
  AssessmentSchema: AssessmentSchema
}