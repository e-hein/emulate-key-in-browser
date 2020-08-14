import { browser, logging } from 'protractor';

export async function expectNoErrorLogs() {
  // Assert that there are no errors emitted from the browser
  let logs = new Array<logging.Entry>();
  try {
    logs = await browser.manage().logs().get(logging.Type.BROWSER);
  } catch (e) {
    // no logs from firefox
  }
  expect(logs).not.toContain(jasmine.objectContaining({
    level: logging.Level.SEVERE,
  } as logging.Entry));
}
