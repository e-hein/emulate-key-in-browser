import { testEmulateTab } from '@app/testing/emulate-tab.shared-spec';
import { browser, logging, Key, element, WebElement, by } from 'protractor';
import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { AppHarness } from '@app/testing/app.harness';
import type { emulateKey } from 'emulate-key-in-browser';

function realTab() {
  return browser.switchTo().activeElement().sendKeys(Key.TAB);
}

const selectableElements = new Array<HTMLElement>();

async function lookupSelectableElements() {
  await element(by.css('body')).click();
  realTab();
  async function asSelectableElement(webElement: WebElement) {
    const id = await webElement.getAttribute('id');
    const tagName = await webElement.getTagName();
    const className = await webElement.getAttribute('class');
    return {
      ident: id || className,
      id,
      tagName,
      className,
    } as HTMLElement & { ident: string };
  }
  const firstElementFinder = await browser.switchTo().activeElement();
  if (!firstElementFinder) { return []; }

  const firstElement = await asSelectableElement(firstElementFinder);
  selectableElements.push(firstElement);
  const hardLimit = 100;
  async function getNextElement() {
    realTab();
    const nextElementFinder = await browser.switchTo().activeElement();
    const nextSelectableElement = await asSelectableElement(nextElementFinder);
    const isFirstElement = nextSelectableElement.ident === firstElement.ident;
    return isFirstElement ? false : nextSelectableElement;
  }
  let nextElement: HTMLElement | false;
  let current = 0;

  // tslint:disable-next-line: no-conditional-assignment
  while (nextElement = await getNextElement()) {
    current++;
    if (current > hardLimit) {
      throw new Error('too many elements!');
    }
    selectableElements.push(nextElement);
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
    await lookupSelectableElements();
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
