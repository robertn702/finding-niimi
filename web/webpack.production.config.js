'use strict'

const _ = require('lodash');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config');

webpackConfig.plugins.push(
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production'),
      BABEL_ENV: JSON.stringify('production'),
    },
  }),
  new webpack.optimize.UglifyJsPlugin({
    comments: false,
    compressor: {
      warnings: false,
    },
  }),
  new webpack.optimize.DedupePlugin()
);

module.exports = webpackConfig
