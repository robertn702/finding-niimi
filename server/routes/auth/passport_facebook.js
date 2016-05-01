'use strict';

const FacebookStrategy = require('passport-facebook').Strategy;
const {facebookAuth} = require('./auth_config');

module.exports = (app, passport, models) => {
  const {
    FacebookUser,
    Sequelize,
    User
  } = models;

  app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));

  app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/login'
  }));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:8080/auth/facebook/callback',
    profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
  }, (token, refreshToken, profile, done) => {
    // if user exists with matching fb profile
    FacebookUser.findOne({
      where: {id: profile.id}
    }).then((fbUser) => {
      if (fbUser) {
        console.log('[passport_facebook] has fbUser');
        return fbUser.getUser();
      }
      console.log('[passport_facebook] no fbUser');
      return Promise.resolve();
    }).then((user) => {
      if (!user) {
        // else if user exists with matching email
        return User.findOne({
          where: {
            email: profile.emails[0].value
          }
        });
      }
      console.log('[passport_facebook] found user from fbUser');
      // return Promise.resolve(user);
      return done(null, user);
    }).then((user) => {
      console.log('[passport_facebook] here');
      // else
      if (!user) {
        // create new user
        return User.create({
          email: profile.emails[0].value
        });
      }

      return Promise.resolve(user);
    }).then((user) => {
      console.log('[passport_facebook] here 2');
      if (!user) {
        return done(null, false);
      }

      // create new fbUser, associate with new user
      FacebookUser.create({
        UserId: user.id,
        email: profile.emails[0].value,
        id: profile.id,
        name: `${profile.name.givenName} ${profile.name.familyName}`,
        token: token
      }).then(() => {
        return done(null, user);
      });
    });
  }));
};
