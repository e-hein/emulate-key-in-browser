// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const path = require('path');

/**
 * @type { { package: string, options: import('webdriver-image-comparison').ClassOptions, } }
 */
const protractorImageComparison = {
  package: 'protractor-image-comparison',
  options: {
    baselineFolder: path.join(__dirname, '../spec-shots/baseline/'),
    formatImageName: `{tag}`,
    screenshotPath: path.join(__dirname, '../spec-shots/'),
    clearRuntimeFolder: true,
  }
};

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    '../testing/**/*.e2e-spec.ts'
  ],
  directConnect: true,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  plugins: [protractorImageComparison],
  onPrepare() {
    require('ts-node').register({
      project: path.join(__dirname, '../testing/tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: StacktraceOption.RAW } }));
  },
};
