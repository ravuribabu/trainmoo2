var School = require('../models/school').School;
var SchoolUser = require('../models/schoolUser').SchoolUser;

module.exports = function(router) {

	router.route('/schools')
			.get(function(req, res){

				if (!req.user) {
					res.status(500).send('ERROR');
					return;
				}
				
				SchoolUser.find({'user' : req.user._id})
						.populate('school')
						.exec(function(err, schoolUsers){

							if (err) {
								console.log(err);
								res.status(500).send(err);
							}

							else {

								if (schoolUsers && schoolUsers.length > 0) {

									var schools = schoolUsers.map(function(schoolUser){return schoolUser.school;})
									res.send(schools);
									
								} else {

									//create school for admin or return blank
									var school = {
										name: 'School'
									};

									School.create(school, function(err, school) {
										if (err) {
											res.status(500).send(err);
										} else {

											var schoolUser = {
												user: req.user,
												school: school,
												type: 'admin',
												email: req.user.local.email,
												firstname: req.user.name.firstname,
												lastname: req.user.name.lastname
											};
											SchoolUser.create(schoolUser, function(err, schoolUser){
												if (err) {
													res.status(500).send(err);
												} else {
													res.send([school]);
												}

											});
											
										}
									})

								}
							}
						});				
			});


	router.route('/school/:schoolid')
		  .get(function(req, res) {
		  	School.findById(req.params.schoolid)
		  		  .exec(function(err, school) {
		  		  	if (err) {
		  		  		res.status(500).send(err);
		  		  	} else {
		  		  		res.send(school);
		  		  	}
		  		  })
		  })
		  .put(function(req, res) {});			


	router.route('/school')
		  .put(function(req, res) { 
		  	var schoolReq = req.body;
		  	if (schoolReq && schoolReq._id) {
		  		School.findById(schoolReq._id, function(err, school) {
		  			if (err) {
		  				res.status(500).send(err);
		  			} else {
		  				Object.assign(school, schoolReq);
		  				school.save(function(err, s) {
		  					if (err) {
		  						res.status(500).send(err);
		  					} else {
		  						res.status(200).send(s);
		  					}
		  				})
		  			}
		  		});

		  	} else {
		  		res.status(500).send('Invalid request ' + schoolReq);
		  	}

		  });


};
