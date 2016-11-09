// app/routes.js
module.exports = function(router, passport) {

    router.post('/signup', function(req, res, next) {
          passport.authenticate('local-signup', function(err, user, info) {
            var flashMessage  = JSON.stringify(req.flash());
            if (err) { return next(err); }
            if (!user) { return res.status(401).json(flashMessage); } //unauthourized
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              return res.json(flashMessage);
            });
          })(req, res, next);
        });


    router.post('/login', function(req, res, next) {
        console.log('Login request Received: ' + JSON.stringify(req.body));
        passport.authenticate('local-login', function(err, user, info) {
            var flashMessage  = JSON.stringify(req.flash());
            console.log('Login Flash : ' + flashMessage);
            if (err) { return next(err); }
            if (!user) { return res.status(401).json(flashMessage); } //unauthourized
            req.logIn(user, function(err) {

              var hour = 3600000
              req.session.cookie.expires = new Date(Date.now() + hour)
              req.session.cookie.maxAge = hour

              if (err) { return next(err); }
              return res.json(user);
            });
          })(req, res, next);
        });

    router.get('/logout', function(req, res) {
      req.session.destroy(function (err) {
              res.redirect('/'); 
            });
    });

    router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    router.get('/auth/google/callback',
            passport.authenticate('google', {
                    successRedirect : '/app/wall' ,
                    failureRedirect : '/app/login'
            }));
};
