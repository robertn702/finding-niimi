'use strict';

const LocalStrategy = require('passport-local').Strategy;

module.exports = (app, passport, models) => {
  const {User} = models;

  app.post('/login', passport.authenticate('local-login', {
    failureFlash: true,
    successFlash: 'Successfully Authenticated (Success Flash)',
    successRedirect: '/'
  }));

  app.post('/signup', passport.authenticate('local-signup', {
    failureFlash: true,
    successFlash: 'Successfully created user (Success Flash)',
    successRedirect: '/'
  }));

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => done(null, user))
        .catch(err => done(err));
  });

  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  }, (req, email, password, done) => {
    User.findOne({where: {email}})
      .then((user) => {
        if (!user) {
          return done(null, false);
        }

        if (!user.validPassword(password)) {
          return done(null, false);
        }
        console.log('[passport_local] login success');
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      })
  }));

  passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  }, (req, email, password, done) => {
    User.findOne({where: {email}})
      .then((user) => {
        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        }

        return User.create({email, password: User.generateHash(password)});
      })
      .then((newUser) => {
        if (!newUser) {
          console.log('[passport_local] failed to create user');
          return done(null, false);
        }

        return done(null, newUser);
      })
      .catch((err) => {
        return done(err);
      });
  }));
}
