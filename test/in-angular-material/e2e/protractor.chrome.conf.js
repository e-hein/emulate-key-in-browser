const config = require('./protractor.base.conf').config;
config.capabilities =  {
  browserName: 'chrome',
  chromeOptions: { args: [ "--headless", "--disable-gpu", "--window-size=1920,1080"] },
};
exports.config = config;
