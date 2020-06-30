const karmaProxies = {
  '/base/emulate-tab.js': '/base/node_modules/emulate-tab/dist/bundles/emulate-tab.amd.js',
  '/base/emulate-key-in-browser.js': '/base/node_modules/emulate-key-in-browser/dist/bundles/emulate-key-in-browser.amd.js',
  '/base/tslib.js': '/base/node_modules/tslib/tslib.js',
  '/assets/': '/base/dist/assets/',
  '/scripts/': '/base/src/',
  '/styles/': '/base/src/',
  '/app/': 'http://localhost:4300/',
};

if (typeof module !== 'undefined') {
  module.exports = karmaProxies;
}