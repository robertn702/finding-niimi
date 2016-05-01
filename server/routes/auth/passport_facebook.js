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
    FacebookUser.findOne({
      where: {id: profile.id}
    }).then((fbUser) => {
      if (!fbUser) {
        return Promise.resolve();
      }
      return fbUser.getUser();
    }).then((user) => {
      if (!user) {
        return User.findOne({
          where: {
            email: profile.emails[0].value
          }
        }).then((user) => {
          if (!user) {
            return Promise.resolve();
          }
          return FacebookUser.create({
            UserId: user.id,
            email: profile.emails[0].value,
            id: profile.id,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            token: token
          }).then((fbUser) => {
            return fbUser.getUser();
          });
        });
      }
      return Promise.resolve(user);
    }).then((user) => {
      if (!user) {
        return User.create({
          email: profile.emails[0].value
        }).then((user) => {
          return FacebookUser.create({
            UserId: user.id,
            email: profile.emails[0].value,
            id: profile.id,
            name: `${profile.name.givenName} ${profile.name.familyName}`,
            token: token
          });
        }).then((fbUser) => {
          return fbUser.getUser();
        });
      }
      return Promise.resolve(user);
    }).then((user) => {
      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    });
  }));
};
