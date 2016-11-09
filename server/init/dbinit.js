var mongoose = require('mongoose');                     // mongoose for mongodb
var _ = require('lodash');
var database = require('../config/database');
var path = require('path');


var mongoose = require('mongoose');
mongoose.connect(database.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var __setOptions = mongoose.Query.prototype.setOptions;

mongoose.Query.prototype.setOptions = function(options, overwrite) {
  __setOptions.apply(this, arguments);
  if (this.options.lean == null) this.options.lean = true;
  return this;
};

db.once('open', function() {

  console.log('we are connected!');

  var Lookup = require('../app/models/Lookup').Lookup;
  Lookup.remove({}, function(){});

  var lookupData = require('./lookupInit').data;
  _.forEach(lookupData, function(lookup){
    Lookup.create(lookup, function(err, lookup){
      console.log(lookup);
    })
  });
  

});

