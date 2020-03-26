const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

const config = merge(baseConfig, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: 'dist',
    host: '0.0.0.0',
    port: 3000
  }
});

module.exports = config;
