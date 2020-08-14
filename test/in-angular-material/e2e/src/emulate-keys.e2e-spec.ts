import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { AsyncEmulateKey, testEmulateArrows, testEmulateTab } from '@app/testing';
import { AppHarness } from '@app/testing/app.harness';
import { browser, by, element, Key, promise, WebElement } from 'protractor';
import { expectNoErrorLogs } from './utils';

function realTab() {
  return browser.switchTo().activeElement().sendKeys(Key.TAB);
}

async function lookupSelectableElements() {
  await element(by.css('body')).click();
  realTab();
  async function asSelectableElement(webElement: WebElement) {
    const id = await webElement.getAttribute('id');
    const tagName = await webElement.getTagName();
    const className = await webElement.getAttribute('class');
    return { id, tagName, className };
  }
  const firstElementFinder = await browser.switchTo().activeElement();
  if (!firstElementFinder) { return []; }

  const firstElement = await asSelectableElement(firstElementFinder);
  const selectableElements = new Array<typeof firstElement>();
  selectableElements.push(firstElement);
  const hardLimit = 100;
  async function getNextElement() {
    realTab();
    const nextElementFinder = await browser.switchTo().activeElement();
    const nextSelectableElement = await asSelectableElement(nextElementFinder);
    const isFirstElement = nextSelectableElement === firstElement || nextSelectableElement.tagName === 'body';
    return isFirstElement ? false : nextSelectableElement;
  }
  let nextElement: typeof firstElement | false;
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
  export const findSelectableElements = () => lookupSelectableElements();
  export const forwards = () => realTab();
}

const realKeys: AsyncEmulateKey = {
  tab: {
    forwards: () => sendTabKey(Key.TAB),
    backwards: () => sendTabKey(Key.chord(Key.SHIFT, Key.TAB)),
    findSelectableElements: () => lookupSelectableElements(),
  },
  shiftTab: () => sendTabKey(Key.chord(Key.SHIFT, Key.TAB)),
  arrow: {
    up: () => sendKeys(Key.ARROW_UP),
    right: () =>  sendKeys(Key.ARROW_RIGHT),
    down: () => sendKeys(Key.ARROW_DOWN),
    left: () => sendKeys(Key.ARROW_LEFT),
  },
  shiftArrow: {
    up: () => sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP)),
    right: () =>  sendKeys(Key.chord(Key.SHIFT, Key.ARROW_RIGHT)),
    down: () => sendKeys(Key.chord(Key.SHIFT, Key.ARROW_DOWN)),
    left: () => sendKeys(Key.chord(Key.SHIFT, Key.ARROW_LEFT)),
  }
};

async function sendKeys(...args: Array<string|number|promise.Promise<string|number>>): Promise<void> {
  await browser.switchTo().activeElement().sendKeys(...args);
}

async function sendTabKey(key: string) {
  const activeElementIdBefore = await (await browser.switchTo().activeElement()).getId();
  await sendKeys(key);
  const activeElementIdAfter = await (await browser.switchTo().activeElement()).getId();
  const preventedDefault = activeElementIdBefore !== activeElementIdAfter;
  return preventedDefault;
}

describe('emulate key', () => {
  const context = {
    app: undefined as AppHarness,
    emulateKey: realKeys,
  };

  beforeEach(async () => {
    await browser.get('/');
    context.app = await ProtractorHarnessEnvironment.loader().getHarness(AppHarness);
  });

  beforeAll(async () => {
    await browser.get('/');
    await lookupSelectableElements();
  });

  describe('tab', () => testEmulateTab(context));
  describe('arrow', () => testEmulateArrows(context));

  afterEach(async () => {
    expectNoErrorLogs();
  });
});
