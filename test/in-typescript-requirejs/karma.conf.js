// Karma configuration
// Generated on Tue Jun 30 2020 12:52:45 GMT+0200 (GMT+02:00)

const withCoverage = true && process.env.COVERAGE;

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine', 'requirejs', 'fixture', 'karma-typescript'],
    karmaTypescriptConfig: {
      ...require('./tsconfig.json'),
      coverageOptions: {
        instrumentation: withCoverage
      }
    },

    // list of files / patterns to load in the browser
    files: [
      { pattern: 'src/**/*.html', included: true },
      { pattern: 'src/**/*.ts', included: false },
      { pattern: 'src/**/*.css', included: false },
      { pattern: 'dist/assets/*.*', included: false },
      { pattern: 'node_modules/emulate-key-in-browser/dist/bundles/emulate-key-in-browser.amd.js', included: false },
      { pattern: 'node_modules/emulate-tab/dist/bundles/emulate-tab.amd.js', included: false },
      { pattern: 'node_modules/tslib/tslib.js', included: false },
      'karma-proxies.js',
      'test-main.js',
    ],

    proxies: require('./karma-proxies'),

    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      '**/*.html': ['html2js'],
      "**/*.ts": "karma-typescript",
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['kjhtml', 'mocha', 'karma-typescript'],
    jasmineHtmlReporter: {
      suppressAll: true, // Suppress all messages (overrides other suppress settings)
      suppressFailed: true // Suppress failed messages
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    client: {
      clearContext: false,
    },
  })
}
