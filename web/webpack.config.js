'use strict'

var webpack = require('webpack');

module.exports = {
  entry: {
    app: [__dirname + '/app/js/main'],
    vendor: [
      'bluebird',
      'history',
      'jquery',
      'lodash',
      'moment',
      'react',
      'react-addons-update',
      'react-bootstrap',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-thunk',
    ],
  },
  output: {
    path: __dirname + '/app',
    filename: 'bundle.js',
    publicPath: '/static/',
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
  debug: true,
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      _: 'lodash',
      jQuery: 'jquery',
      React: 'react',
      ReactDOM: 'react-dom'
    }),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    modulesDirectories: [
      'app/js/actions',
      'app/js/components/shared',
      'app/js/constants',
      'app/js/utils',
      'node_modules',
    ],
    extensions: ['', '.js', '.jsx', '.json'],
  },
  module: {
    loaders: [{
      test: /\.json$/,
      loader: 'json',
    }, {
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel',
    }, {
      test: require.resolve('react'),
      loader: 'expose?React',
    }],
  },
};
