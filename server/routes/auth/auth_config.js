'use strict';

require('dotenv').load();

const HOST = 'http://localhost:8080/';

module.exports = {
  facebookAuth: {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: HOST + 'auth/facebook/callback',
  },
};
