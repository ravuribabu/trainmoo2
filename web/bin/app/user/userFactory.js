'user stict';

var user = require('angular').module('user');

user.factory('userFactory', function($http){
	return {
		getUser: function(){
			return $http.get('api/user');
		},
		post: function(data){
			return $http.post('api/users', data);
		},
		put: function(data, id){
			return $http.put('api/users/' + id, data);
		}
	};
});
