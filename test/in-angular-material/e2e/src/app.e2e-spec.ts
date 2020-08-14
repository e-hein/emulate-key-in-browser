import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { testApp } from '@app/testing';
import { browser } from 'protractor';
import { expectNoErrorLogs } from './utils';

describe('workspace-project App', () => {
  beforeEach(() => browser.get('/'));
  testApp(
    () => ProtractorHarnessEnvironment.loader(),
    () => Promise.resolve().then(() => browser.driver.executeScript(() => document.activeElement?.id)),
  );

  afterEach(async () => {
    expectNoErrorLogs();
  });
});

// fdescribe('app with webdriger', () => {
//   let wd: WebdriverIO.BrowserObject;
//   beforeEach(async () => {
//     wd = await remote({ capabilities: {
//       browserName: 'firefox',
//       'moz:firefoxOptions': {
//         binary: '/Applications/Firefox.app/Contents/MacOS/firefox-bin'
//       },
//     }});
//     wd.navigateTo('http://localhost:4200');
//   });
//   it ('take screenshot', async () => {
//     const result = await wd.takeScreenshot();
//     expect(result).toBeTruthy();
//   });
//   afterEach(async () => {
//     await wd.deleteSession();
//   });
// });
