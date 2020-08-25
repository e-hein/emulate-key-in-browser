const config = require('./protractor.base.conf').config;
config.capabilities = require('./capability.firefox');
exports.config = config;
