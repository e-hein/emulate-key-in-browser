import { browser, logging } from 'protractor';

export async function expectNoErrorLogs() {
  if (!process.env.capability_getLogs) {
    return;
  }

  // Assert that there are no errors emitted from the browser
  const logs = await browser.manage().logs().get(logging.Type.BROWSER);
  expect(logs).not.toContain(jasmine.objectContaining({
    level: logging.Level.SEVERE,
  } as logging.Entry));
}

export function detailedWebDriverLogs() {
  const httpLogger = logging.getLogger('webdriver.http');
  const logHandler = (logEntry: logging.Entry) => console.log('webdriver.http', logEntry.level, logEntry.message);
  httpLogger.addHandler(logHandler);
  const origLogLevel = httpLogger.getLevel();
  httpLogger.setLevel(logging.Level.ALL);

  const reset = () => {
    httpLogger.setLevel(origLogLevel);
    httpLogger.removeHandler(logHandler);
  };
  return reset;
}
