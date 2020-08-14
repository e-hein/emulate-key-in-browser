const config = require('./protractor.base.conf').config;
config.capabilities =  { browserName: 'firefox' };
exports.config = config;
