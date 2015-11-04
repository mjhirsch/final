// Requires \\
var express = require('express');
var bodyParser = require('body-parser');

// Connect to DB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/passport-demo')

// Auth Requires
var session = require('express-session');
var passport = require('passport');

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

var User = require('./models/user');

// Create Express App Object \\
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var userCtrl = require('./controllers/userCtrl.js')
var reviewsCtrl = require('./controllers/reviewsCtrl.js')
var rentalCtrl = require('./controllers/rentalCtrl.js')

// Session Setup
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false
}));

// Hook in passport to the middleware chain
app.use(passport.initialize());

// Hook in the passport session management into the middleware chain.
app.use(passport.session());

app.use(express.static(__dirname + '/public'));

// Application Configuration \\


// SERIALIZATION:
//  This small subset of code will take a user object, used
//  in our JS, and convert it into a small, unique, string
//  which is represented by the id, and store it into the
//  session.
passport.serializeUser(function(user, done){
  done(null, user.id);
});

// DESERIALIZATION:
//  Essentially the inverse of above. This will take a user
//  id out of the session and convert it into an actual
//  user object.
passport.deserializeUser(function(id, done){
  User.findById(id, function(err, user){
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: '34694863364-armuht6k15n6i34uki4hs0ftdftapd8o.apps.googleusercontent.com',
    clientSecret: '-KQcWTNQAUwF5o9tOjqx7vWx',
    callbackURL: "http://104.236.61.63/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile)
    // console.log(User.findOne({googleID : profile.id}))

    User.findOne({googleID : profile.id}, function(err, doc){
    	console.log(accessToken, refreshToken)
    	if (doc) {
    		return done(null, doc)
    	} 
    	else{
    		// console.log(profile.id)
    		var user = new User ({
    			googleID     : profile.id,
    			email        : profile.emails[0].value,
    			firstName    : profile.name.givenName,
    			lastName     : profile.name.familyName,
    			accessToken  : accessToken,
    			refreshToken : refreshToken

    		})

    		user.save( function(err, doc){
    			if(err){
    				console.log(err)
    			}
    			else{
    				return done(null, doc)	
    			}
    			
    		})
    	};
    })

  }
));

// Routes \\
// var authenticationController = require('./controllers/authentication');

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://mail.google.com/', 'https://www.googleapis.com/auth/gmail.modify', 'https://www.googleapis.com/auth/gmail.readonly', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'], accessType: 'offline'}));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/uhoh' }),
  function(req, res) {
    // Successful authentication, redirect home.
    // console.log(req)
    res.redirect('/user/'+req.user.googleID);
  });

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// This route is designed to send back the logged in user (or undefined if they are NOT logged in)
app.get('/api/me', function(req, res){
	res.send(req.user)
})


// ***** IMPORTANT ***** //
// By including this middleware (defined in our config/passport.js module.exports),
// We can prevent unauthorized access to any route handler defined after this call
// to .use()
// app.use(passportConfig.ensureAuthenticated);
app.get('/user/:googleID/', function(req, res){
  res.sendFile('/html/home.html', {root : './public'})
});

app.get('/', function(req, res){
  res.sendFile('/html/index.html', {root : './public'})
});
// app.get('/superSensitiveDataRoute')


app.get('/api/reviews', reviewsCtrl.findReviews)
app.get('/api/reviews/:googleID', reviewsCtrl.findReviews)
app.get('/api/reviews/rental/:specificRentalID', reviewsCtrl.findRentalReviews)
app.get('/api/user/:googleID', userCtrl.findUsers)
app.get('/api/rental', reviewsCtrl.findRentals)
app.get('/api/rental/:rentalID', reviewsCtrl.findRentals)
app.post('/api/neighbors', reviewsCtrl.findNeighbors)
app.post('/api/reviews', reviewsCtrl.addReview)
app.post('/api/reviews/:_id', reviewsCtrl.updateReview)



// Creating Server and Listening for Connections \\
var port = 80
app.listen(port, function(){
  console.log('Server running on port ' + port);

});
