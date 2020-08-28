const config = require('./protractor.base.conf').config;
config.multiCapabilities = [
  require('./capability.chrome'),
  require('./capability.firefox'),
];
exports.config = config;
