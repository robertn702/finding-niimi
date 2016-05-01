'use strict';

const path = require('path');

const distFilePath = (filename) => {
  console.log('[pages] filename: ', filename);
  return path.join(__dirname, '/../../../web/dist/', filename);
};

const isLoggedIn = (req, res, next) => {
  // console.log('[pages] req.isAuthenticated: ', req.isAuthenticated);
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = (app) => {
  app.get('/', isLoggedIn, (req, res) => {
    console.log('[pages] @get /');
    res.sendFile(distFilePath('index.html'));
  });

  app.get('/login', (req, res) => {
    console.log('[pages] @get /login');
    res.sendFile(distFilePath('login.html'));
  });

  app.get('/signup', (req, res) => {
    console.log('[pages] @get /signup');
    res.sendFile(distFilePath('signup.html'));
  });
}
