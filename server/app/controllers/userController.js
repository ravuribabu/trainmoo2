var User = require('../models/user').User;

module.exports = function(router) {

	router.route('/user')
			.get(function(req, res){
				console.log('Requesting for user' + req.user);
				User.findById(req.user, function(err, user){
					if (err) {
						console.log(err);
						res.send(err);
					}
					else {
						res.send(user);
					}
				})
			})
			
	router.route('/users')
			.get(function(req, res){
				console.log("GET USERS");
				User.find({})
					.exec(function(err, users){
					if (err) {
						res.send(err);
					}
					else {
						res.json(users);
					}
				});
			});

	router.route('/users/:user_id')
		  .get(function(req, res) {

		  	console.log('RECEIVED Request for userid ' + req.params.user_id);

		  	User
			  	.findById(req.params.user_id)
			  	.exec(function(err, user){
			  		if (err) {
			  			console.log('ERROR: ' + err + ' USER' + user);
			  			res.send(err);
			  		} else {
			  			console.log('SUCCESS: ' + err + ' USER' + user);
			  			res.json(user);
			  		}
			  	});

		  })
		  .put(function(req, res) {
			User.findById(req.params.user_id, function(err, user){
					  		if (err) {
					  			res.send(err);
					  		} else {
					  			var newUser = req.body;
					  			user.name = newUser.name;
					  			user.city = newUser.city;
					  			user.current = newUser.current;
					  			user.email = newUser.email;
					  			user.experience = newUser.experience;
					  			user.isTeacher = newUser.isTeacher;
					  			user.password = newUser.password;
					  			user.phone = newUser.phone;
					  			user.social = newUser.social;
					  			user.specializations = newUser.specializations;
					  			user.title = newUser.title;
					  			user.trainingStyle = newUser.trainingStyle;
					  			user.userid = newUser.userid;
					  			user.zipcode = newUser.zipcode;
					  			user.certifications = newUser.certifications;
					  			user.summary = newUser.summary;
					  			user.address = newUser.address;
					  			user.picture = newUser.picture;
							  	user.name = newUser.name;
					  			user.userType = newUser.userType;

					  			user.save(function(err){
					  				if (err){
					  					res.send(err);
					  				} else {
					  					res.send("User updated sucessfully");

					  				}

					  			});
					  		}
					  	});
		  })
		  .delete(function(req, res){

		  });
};
