const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const User = require('../models/user');
const crypto = require('crypto');
const env = require('./environment.js');

passport.use(new GitHubStrategy({
  clientID: env.github_client_ID,
  clientSecret: env.github_client_Secret,
  callbackURL: env.github_callbackURL
},
function(accessToken, refreshToken, profile, done) {

        //  find the user
        User.findOne({email: profile.emails[0].value}).exec(function(err, user){
          if(err){
              console.log('error in google strategy passport', err);
              return;
          }


          if(user){
              // if found, set this user as req.user
              return done(null, user);
          }else{
              //if not found, create the user and set it as req.user
              User.create({

                  name: profile.displayName,
                  email: profile.emails[0].value,
                  password: crypto.randomBytes(20).toString('hex')
              }, function(err, user){
                  if(err){

                      console.log('error in creating user google strategy passport', err);
                      return;

                  }else{
                      return done(null, user);
                  }
              });
          }
      });


}
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


module.exports = passport;
