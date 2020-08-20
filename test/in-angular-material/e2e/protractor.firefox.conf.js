const config = require('./protractor.base.conf').config;
config.capabilities =  {
  browserName: 'firefox',
  firefoxOptions: {
    args: ['--headless'],
  },
  'moz:firefoxOptions': {
    args: ['--headless'],
  },
};
exports.config = config;
