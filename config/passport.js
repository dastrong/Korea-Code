const passport   = require("passport"),
FacebookStrategy = require('passport-facebook').Strategy,
  LocalStrategy  = require('passport-local').Strategy,
  User           = require("../models/user");
                   require('dotenv').config();

module.exports = function(passport){

// LOCAL SIGNUP STRATEGY
  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done){
    User.findOne({email:email}, function(err, isEmailTaken) {
      if(err) return done(err);
      if(isEmailTaken) return done(null, false, 'A user with that email already exists');
      let newUser = new User({
        email: req.body.email,
        name:  req.body.name,
        image: req.body.image,
        bio:   req.body.bio
      });
      User.createUser(newUser, password, function(err, user){
        if(err) return done(err);
        return done(null, user, `Thanks for joining, ${user.name}!`);
      });
    });
  }));
  
// LOCAL LOGIN STRATEGY
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password', 
  }, function(email, password, done){
    User.findOne({email:email}, function(err, user) {
      // ERROR OCCURED
      if(err)   return done(err);
      // USER NOT FOUND
      if(!user) return done(null, false, "Sorry, we don't have a user with that email in use");
      // USER FOUND SO CHECKING PASSWORD
      User.verifyPassword(password, user.password, function(err, isMatch){
        if(err)      return done(err);
        // PASSWORD DOES NOT MATCH
        if(!isMatch) return done(null, false, "Wrong password. Please try again");
        // PASSWORDS MATCH
        if(isMatch)  return done(null, user, `Welcome Back, ${user.name}`);
      });
    });
  }));
  
  // FACEBOOK STRATEGY
  passport.use(new FacebookStrategy({
    clientID: process.env.FB_CLIENT_ID,
    clientSecret: process.env.FB_CLIENT_SECRET,
    callbackURL: "https://koreacode.herokuapp.com/auth/facebook/callback",
    profileFields: ['id', 'email']
  }, function(accessToken, refreshToken, profile, cb) {
    User.findOne({ email: profile.emails[0].value }, function (err, user) {
      if(err)   return cb(err);
      if(!user) return cb(null, false, "Sorry, we don't have a user with that email in use");
      if(user)  return cb(null, user, `Welcome Back, ${user.name}`);
      });
  }));
  
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
  
};