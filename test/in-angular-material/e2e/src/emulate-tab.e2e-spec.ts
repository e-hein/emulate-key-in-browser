import { testEmulateTab } from '@app/testing/emulate-tab.shared-spec';
import { browser, logging, Key, element, WebElement, by } from 'protractor';
import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { AppHarness } from '@app/testing/app.harness';
import type { emulateKey } from 'emulate-key-in-browser';

function realTab() {
  return browser.switchTo().activeElement().sendKeys(Key.TAB);
}

const selectableElements = new Array<HTMLElement>(
);
async function lookupSelectableElements() {
  await element(by.css('body')).click();
  realTab();
  async function asHTMLElement(webElement: WebElement) {
    const id = await webElement.getAttribute('id') || await webElement.getAttribute('class');
    return {
      id,
    } as HTMLElement;
  }
  const firstElementPromise = browser.switchTo().activeElement();
  const firstElement = await firstElementPromise;
  const firstElementId = await firstElement.getId();
  if (!firstElement) { return []; }

  selectableElements.push(await asHTMLElement(firstElement));
  const hardLimit = 100;
  async function getNextElement() {
    realTab();
    const isFirstElement = await (await browser.switchTo().activeElement()).getId() === firstElementId;
    return !isFirstElement && await browser.switchTo().activeElement();
  }
  let nextElement: WebElement | false;
  let current = 0;

  // tslint:disable-next-line: no-conditional-assignment
  while (nextElement = await getNextElement()) {
    current++;
    if (current > hardLimit) {
      throw new Error('too many elements!');
    }
    selectableElements.push(await asHTMLElement(nextElement));
  }
  return selectableElements;
}

// tslint:disable-next-line: no-namespace
namespace realTab {
  export const backwards = () => browser.switchTo().activeElement().sendKeys(Key.chord(Key.SHIFT, Key.TAB));
  export const findSelectableElements = () => selectableElements;
  export const forwards = () => realTab();
}

const realKeys = {
  tab: realTab,
} as typeof emulateKey;

describe('emulate-tab', () => {
  let app: AppHarness;
  beforeEach(async () => {
    await browser.get('/');
    app = await ProtractorHarnessEnvironment.loader().getHarness(AppHarness);
  });

  beforeAll(async () => {
    await browser.get('/');
    lookupSelectableElements();
  });

  testEmulateTab(() => app, realKeys);

  afterEach(async () => {
    // Assert that there are no errors emitted from the browser
    const logs = await browser.manage().logs().get(logging.Type.BROWSER);
    expect(logs).not.toContain(jasmine.objectContaining({
      level: logging.Level.SEVERE,
    } as logging.Entry));
  });
});
