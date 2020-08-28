let currentSpecResult: jasmine.CustomReporterResult;

jasmine.getEnv().addReporter({
  specStarted: (result) => currentSpecResult = result,
});

export function getCurrentSpecResult() {
  return currentSpecResult;
}
