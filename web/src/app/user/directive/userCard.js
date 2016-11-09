var user = require('angular').module('user');

user.directive('userCard', function(){
	return {
			restict : 'EA',
			scope: {
			},
			templateUrl: 'assets/js/user/directive/userCard.html',
			controller: 'userController'
	};
});
