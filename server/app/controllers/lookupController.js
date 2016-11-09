"use strict";
var Lookup = require('../models/Lookup').Lookup;
var mongoose = require('mongoose');

module.exports = function(router) {

	router.route('/lookup/:group')
		  .get(function(req, res){
		  	Lookup.find( { 'group' : req.params.group } ).exec(function(err, lookups){
			  		if (err) {
			  			console.log(err);
			  			res.send(err); 
			  		} else {
			  			res.json(lookups);
			  		}
			  	});
		  });
	
};