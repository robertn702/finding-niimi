'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const flash = require('connect-flash');
const passport = require('passport');
const path = require('path');
const session = require('express-session');

const models = require('./db/models');
require('dotenv').load();

const app = express();
const port = process.env.PORT || 8080;

// app.use('/', express.static(__dirname + '/../web/dist'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./routes/pages/pages')(app);
require('./routes/auth/passport_local')(app, passport, models);
require('./routes/auth/passport_facebook')(app, passport, models);

app.use(express.static(__dirname + '/../web/dist'));

models.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log('listening on port: ' + port);
  });
});
