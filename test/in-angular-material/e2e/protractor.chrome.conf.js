const config = require('./protractor.base.conf').config;
config.capabilities =  {
  browserName: 'chrome',
};
exports.config = config;
