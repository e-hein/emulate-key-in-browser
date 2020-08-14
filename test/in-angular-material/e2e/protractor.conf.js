const config = require('./protractor.base.conf').config;
config.multiCapabilities = [
  {
    browserName: 'chrome',
    chromeOptions: { args: [ "--headless", "--disable-gpu", "--window-size=1920,1080"] },
  },
  {
    browserName: 'firefox',
    firefoxOptions: {
      args: ['--headless'],
    },
    'moz:firefoxOptions': {
      args: ['--headless'],
    },
  },
];
exports.config = config;
