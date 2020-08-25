import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { AppHarness, testApp, itShouldMatchInitialScreenshot } from '@app/testing';
import { SharedSpecContextWithProtractorKeys } from '@app/testing/protractor';
import { browser } from 'protractor';
import { expectNoErrorLogs } from './utils';

describe('emulate key in angular demo app', () => {
  beforeEach(() => {
    browser.get('/');
  });
  const context = new SharedSpecContextWithProtractorKeys();
  beforeEach(() => context.refreshContext());

  if (process.env.capability_mouseMove) {
    testApp(context);
  } else {
    it('just testing startup (can\'t simulate hover)', async () => {
      const app = await ProtractorHarnessEnvironment.loader().getHarness(AppHarness);
      const demoForm  = await app.getDemoFrom();
      expect(await demoForm.getControl('first input')).toBeTruthy();
    });

    itShouldMatchInitialScreenshot(context);
  }

  afterEach(async () => {
    expectNoErrorLogs();
  });
});
