var login = require('angular').module('login');

login.controller('loginController', function($rootScope, $scope, $state, $location, $window, authenticationFactory, SweetAlert, appForm){


	init()
	function init(){

		$scope.user = {};

		$scope.authWithGoogle = function(){

			$window.location.href  = '/api/auth/google';
		};

		$scope.form = new appForm.AppForm(angular, function(form){
			authenticationFactory.login($scope.user)
								  .success(function(user){
								  	if (user && user._id ) {
								  		console.log('Successfully loggedin!!');

								  		$rootScope.user = {
								  			id: user._id,
								  			name: user.name
								  		}
								  		$state.go('app.apph.wall');
								  		//$window.location.href = '/school';
										//$state.go('index2.school', {userid:user.userid});
								  	} else {
										$state.go('app.appt.user' , { credentialid :  user.credentialid } );
								  	}

								  })
								  .error(function(err){
								  	var error = JSON.parse(err);
								  	SweetAlert.swal(
									  	{
									  		title: "Error?",
									  		text: ((error && error.loginMessage) ?error.loginMessage[0] : 'Signup process failure'),
									  		type: "error",
									  		showCancelButton:false,
									  		confirmButtonText: "Ok!",
									  		closeOnConfirm: true
									  	},
									  	function(){
									  	 }
									);
								  });
		});

	} //END INIT
});
