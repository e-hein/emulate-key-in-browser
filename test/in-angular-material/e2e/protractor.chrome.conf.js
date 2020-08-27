const config = require('./protractor.base.conf').config;
config.capabilities = require('./capability.chrome');
exports.config = config;
