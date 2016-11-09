var login = require('angular').module('login');

login.factory('authenticationFactory', function($http){
	return {
		signup: function(user){
			return $http.post('api/signup/', user);
		},
		login: function(user){
			return $http.post('api/login/', user);
		},
		loginGoogle:function(user){
			return $http.get('auth/google/', user);
		},
	};
});
