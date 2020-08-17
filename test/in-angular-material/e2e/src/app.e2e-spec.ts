import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { AppHarness, testApp } from '@app/testing';
import { browser } from 'protractor';
import { expectNoErrorLogs } from './utils';

describe('emulate key in angular demo app', () => {
  beforeEach(() => {
    browser.get('/');
  });
  if (process.env.capability_mouseMove) {
    testApp(
      () => ProtractorHarnessEnvironment.loader(),
      () => Promise.resolve().then(() => browser.driver.executeScript(() => document.activeElement?.id)),
    );
  } else {
    it('just testing startup (can\'t simulate hover)', async () => {
      const app = await ProtractorHarnessEnvironment.loader().getHarness(AppHarness);
      const demoForm  = await app.getDemoFrom();
      expect(await demoForm.getControl('first input')).toBeTruthy();
    });
  }

  afterEach(async () => {
    expectNoErrorLogs();
  });
});
