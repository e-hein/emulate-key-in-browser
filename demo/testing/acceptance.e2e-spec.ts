import { HarnessLoader, TestElement } from '@angular/cdk/testing';
import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { browser, ExpectedConditions, element, by } from 'protractor';
import { checkScreen, DemoHarness, PrivacySettingsHarness, ReadmeHarness, webElementFromTestElement } from './lib';

describe('accaptance', () => {
  let demoHarness: DemoHarness;
  let loader: HarnessLoader;
  let readme: ReadmeHarness;
  let privacySettings: PrivacySettingsHarness;


  it ('app should start', async () => {
    browser.waitForAngularEnabled(false);
    await browser.get('/');

    loader = ProtractorHarnessEnvironment.loader();
    demoHarness = await loader.getHarness(DemoHarness);

    expect(demoHarness).toBeTruthy();
  });

  describe('initially', () => {
    beforeEach(async () => {
      await browser.switchTo().frame(0);
      privacySettings = await loader.getHarness(PrivacySettingsHarness);
    });

    it ('should show privacy settings', async () => {
      expect(privacySettings).toBeTruthy('found privacy settings');
      expect(await checkScreen('acc-0-privacy-settings')).toBeLessThan(1)
    });
  });

  describe('after accepting all', () => {
    beforeAll(() => privacySettings.acceptAll());

    it ('should show readme with shields', async () => {
      readme = await loader.getHarness(ReadmeHarness);
      await Promise.resolve(browser.driver.wait(ExpectedConditions.elementToBeClickable(element.all(by.css('a[target=_blank]')).first())));
      const npmShield = await readme.getNpmShield();
      const npmShieldImage = await npmShield.getImage();
      await waitUntilImageLoaded(npmShieldImage);
      expect(await checkScreen('acc-1-readme')).toBeLessThan(1);
    });
  });

  describe('after clicking on "example in angular material"', async () => {
    beforeAll(async () => {
      await browser.get('/');
      browser.waitForAngularEnabled(false);
      demoHarness = await loader.getHarness(DemoHarness);
      await demoHarness.clickOnAngularExampleLink();
      await browser.switchTo().frame(0);
    });

    it ('should show angular sample', async () => {
      await browser.wait(ExpectedConditions.elementToBeClickable(element(by.css('#first-input'))));
      expect(await checkScreen('acc-2-angular')).toBeLessThan(1);
    });
  });

  describe('after clicking on "example in plain html"', async () => {
    beforeAll(async () => {
      await browser.driver.switchToParentFrame();
      await demoHarness.clickOnHtmlJsExampleLink();
      await browser.switchTo().frame(0);
    });

    it ('should show plain html js sample', async () => {
      expect(await checkScreen('acc-3-html-js')).toBeLessThan(1);
    });
  });
});

function waitUntilImageLoaded(element: TestElement) {
  const img = webElementFromTestElement(element);
  return browser.driver.wait(async () => {
    const size = await img.getSize();
    return size.height > 5;
  });
}