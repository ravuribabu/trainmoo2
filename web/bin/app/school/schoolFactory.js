'use strict';

var angular = require('angular')
var school = angular.module('school')

school.factory('schoolFactory', function($http, SweetAlert){

return {

	getProgramsclasses: function(schoolid){
		return $http.get('api/programsclasses/' + schoolid );
	},
	getSchool: function(schoolid) {
		return $http.get('api/school/' + schoolid);
	},
	getSchools: function() {
		return $http.get('api/schools');
	},
	updateSchool: function(school) {
		return $http.put('api/school', school);
	},

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


	//Class Users

	getClassSchoolUsers: function(classid){
		return $http.get('api/class/' + classid + '/schoolusers');
	},

	getClassUsers: function(classid){
		return $http.get('api/class/' + classid + '/users');
	},

	saveOrUpdateClassUser: function(user) {
		if (user.id) {
			return $http.put('api/class/' + user.class + '/users', user);
		} else {
			return $http.post('api/class/' + user.class + '/users', user);
		}
	},
	deleteClassUser: function(userid) {
		return $http.delete('api/class/user/' + userid);
	},


	//SChool Users
	getSchoolUsers: function(schoolid) {
		return $http.get('api/school/' + schoolid + "/users");
	},
	saveOrUpdateSchoolUser: function(user) {
		if (user._id) {
			return $http.put('api/school/' + user.school + '/users', user);
		} else {
			return $http.post('api/school/' + user.school + '/users', user);
		}
	},
	deleteSchoolUser: function(userid) {
		return $http.delete('api/school/user/' + userid);
	},

	saveOrUpdateUser(user) {
		if (user.class) {
			return this.saveOrUpdateClassUser(user);
		} else {
			return this.saveOrUpdateSchoolUser(user);
		}
	}





};

});
