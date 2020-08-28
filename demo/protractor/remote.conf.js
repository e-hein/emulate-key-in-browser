const baseConfig = require('./base.conf').config;

exports.config = {
  ...baseConfig,

  capabilities: require('./capability.chrome'),
};
