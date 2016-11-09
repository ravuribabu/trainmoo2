'use strict';
var userList = require('angular').module('userList');
userList.factory('userListFactory', function($http){
	return {
		getUsers: function(){
			return $http.get('api/users');
		}
	};
});
