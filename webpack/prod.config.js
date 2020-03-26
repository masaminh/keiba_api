const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

const config = merge(baseConfig, {
  mode: 'production'
});

module.exports = config;
