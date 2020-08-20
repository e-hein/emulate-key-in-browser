import { browser, logging } from 'protractor';
import chalk from 'chalk';

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
  const logHandler = (logEntry: logging.Entry) => {
    if (logEntry.message.includes('getNg1Hooks')) {
      console.log('webdriver.http -> waiting for angular ready');
    } else if (logEntry.message.includes('<<<')) {
      console.log(logEntry.message
      .replace(/>>>\n(.*)(.|\n)*?(\{(.|\n)*?)?<<<\nHTTP\/1\.1 200(.|\n)*?(\{(.|\n)*)?$/, (
        all, requestUrl, requestHeaders, requestBody, between, responseHeader, responseBody,
      ) => {
        return ''
          + '\n[requestUrl   ]:' + requestUrl
//          + '\n[requstHeaders]: ' + requestHeaders
          + (requestBody ? '\n[requestBody]:\n' + requestBody : '')
          + '\n' + (responseBody ? '[responseValue]: ' + JSON.stringify(JSON.parse(responseBody).value, null, 2) : '<<<< OK')
        ;
      }).replace(/\n/g, '\n  ')
    );
    }
  };
  httpLogger.addHandler(logHandler);
  const origLogLevel = httpLogger.getLevel();
  httpLogger.setLevel(logging.Level.FINER);

  const reset = () => {
    httpLogger.setLevel(origLogLevel);
    httpLogger.removeHandler(logHandler);
  };
  return reset;
}
