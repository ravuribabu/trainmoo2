'use strict';

var angular = require('angular')
var classModule = angular.module('class')

classModule.factory('classFactory', function($http, SweetAlert){

return {

	getClasses: function(programid) {
		if (programid) {
		 return $http.get('api/program/' + programid + '/classes');
		} else {
			return this.getPrograms();
		}
	},
	getPrograms: function() {
		 return $http.get('api/programs');
	},
	getClass: function(classid) {
		return $http.get('api/class/' + classid);
	},
	updateClass: function(clazz) {
		return $http.put('api/class', clazz);
	},
	createClass: function(clazz) {
		return $http.post('api/classes' , clazz);
	},



	getEvents:function(classid) {
		return $http.get('api/class/' + classid + "/events");
	},
	createEvent:function(classid, event) {
		return $http.post('api/class/' + classid + "/events", event);
	},
	getEvent: function(eventid) {
		return $http.get('api/event/' + eventid);
	},
	updateEvent: function(event) {
		return $http.put('api/event/' + event._id, event);
	},
	removeEvent: function(eventid) {
		return $http.delete('api/event/' + eventid);
	},



	getUsers: function(classid){
		return $http.get('api/class/' + classid + '/users');
	},
	addUser: function(classid, classUser){
		return $http.post('api/class/' + classid + '/users', classUser);
	},
	updateUser: function(classid, classUser){
		return $http.put('api/class/' + classid + '/users', classUser);
	},
};

});
