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
  }
};
