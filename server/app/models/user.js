var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

//Schemas

var UserSchema = new Schema({

  name: {
      firstname: { type: String, required: true },
      lastname: { type: String, required: true },
    },

  title: { type: String, required: false },
  dob: { type: Date, required: false },
  phone: {
    type: Number, required: false
  },

  gender: {
    type: String,
    enum: ['male', 'female']
  },
  summary: String,
  address: String,
  city: String, zipcode: Number,
  picture:  {
    fileid: {type:String},
    fileName: {type:String},
    size: Number,
    type: { type: String, enum: [ 'jpeg', 'jpg', 'png']},
    thumbnailid: {type:String}
  },

  specializations: [String],
  certifications: [String],
  experience: Number,
  current: String,
  trainingStyle: [String],

  
  local            : {
      email        : String,
      password     : String,
  },
  facebook         : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
  },
  twitter          : {
      id           : String,
      token        : String,
      displayName  : String,
      username     : String
  },
  google           : {
      id           : String,
      token        : String,
      email        : String,
      name         : String
  },
  userType: { type: String, enum: ['Teacher', 'Student', 'Parent', 'Admin'], required: true} ,

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },

});

UserSchema.virtual('shortname').get(function(){
  return this.name.firstname + " "+ this.name.lastname.charAt(0);
});

UserSchema.set('toJSON', { getters: true, virtuals: true });


UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// on every save, add the date
UserSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updated_at = currentDate;
  if (!this.created_at)
    this.created_at = currentDate;

  next();

});

var User = mongoose.model('User', UserSchema);
module.exports = {
  User : User,
  UserSchema: UserSchema
}
