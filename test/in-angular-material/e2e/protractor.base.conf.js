// @ts-check
// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter, StacktraceOption } = require('jasmine-spec-reporter');
const path = require('path');

/**
 * @type { import("protractor").Config }
 */
exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './src/**/*.e2e-spec.ts'
  ],
  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  plugins: [{
    package: 'protractor-image-comparison',
    options: {
      baselineFolder: path.join(process.cwd(), './spec-shots/baseline/'),
      formatImageName: `{tag}`,
      screenshotPath: path.join(process.cwd(), './spec-shots/'),
      savePerInstance: true,
    },
  }],
  onPrepare() {
    const tsNode = require('ts-node');
    const tsConfigPaths = require('tsconfig-paths');
    const tsConfigBasePath = require.resolve('../tsconfig.base.json');
    const tsConfigBaseOptions = require(tsConfigBasePath).compilerOptions;
    tsConfigPaths.register({
      baseUrl: path.join(path.dirname(tsConfigBasePath), tsConfigBaseOptions.baseUrl),
      paths: tsConfigBaseOptions.paths,
    });
    tsNode.register({
      project: path.join(__dirname, './tsconfig.json')
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: StacktraceOption.RAW } }));
    // @ts-ignore
    return global.browser.getCapabilities().then(async (capabilities) => {
      const browserName = capabilities.get('browserName');
      process.env.cpabilites_browserName = browserName;
      if (browserName === 'firefox') {
        delete process.env.capability_mouseMove;
        delete process.env.capability_getLogs;
        delete process.env.capability_simulateArrowKeys;
        process.env.bug_multipleArrows = 'firefox seems to send sometimes multiple arrows when controled by webdriver';
        process.env.bug_cannotSelectPos0 = 'firefox seems not to be able to write at pos 0';
      } else {
        process.env.capability_mouseMove = 'true';
        process.env.capability_getLogs = 'true';
        process.env.capability_simulateArrowKeys = 'true';
        delete process.env.bug_multipleArrows;
        delete process.env.bug_cannotSelectPos0;
      }
    })
  }
};
