var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)
var _ = require('lodash');
var database = require('./config/database');
var passport = require('passport');
var flash    = require('connect-flash');
var session      = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');

require('./config/passport')(passport); // pass passport for configuration


// configuration =================
app.use(express.static(__dirname + '/../web/dist/'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());
app.use(cookieParser())
app.use(session({ cookie: { maxAge: 60000 },
                  secret: 'woot',
                  resave: false,
                  saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

var mongoose = require('mongoose');
mongoose.connect(database.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
var __setOptions = mongoose.Query.prototype.setOptions;

mongoose.Query.prototype.setOptions = function(options, overwrite) {
  __setOptions.apply(this, arguments);
  if (this.options.lean == null) this.options.lean = true;
  return this;
};

db.once('open', function() {
  console.log('we are connected!');
});

//Rambabu Ravuri
var router = express.Router();

router.use(function(req, res, next) {
  console.log('Request received for: ' + req.url);
	next();
});


require('./app/controllers/controllers')(router);
require('./app/routes')(router, passport);


app.use('/api', function(req, res, next) {
  console.log('REQUEST URL: ' + req.url);

//  if (req.url === '/login/' || req.url === '/signup/' || req.isAuthenticated()) {
      return next();
//    }
//    res.status(401).send('Unauthorized');
}, router);

// app.get(['/school', '/app/users'], function(req, res) {
//    console.log("forwarding to index_top.html ");
//    res.sendfile(path.resolve(__dirname + '/../web/dist/index_top.html'));
// });


app.use(function(req, res) {
   res.sendfile(path.resolve(__dirname + '/../web/dist/index.html'));
});



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/app/login');
}

console.log(JSON.stringify(router.stack));
var server = app.listen(8080);
console.log("App listening on port 8080");
