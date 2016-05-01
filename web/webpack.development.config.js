'use strict'

const _ = require('lodash');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

webpackConfig.entry.app.unshift('webpack-hot-middleware/client');
webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('development'),
      BABEL_ENV: JSON.stringify('development'),
    },
  })
);

module.exports = webpackConfig
