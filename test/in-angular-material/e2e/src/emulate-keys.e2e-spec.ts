import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import {
  AsyncEmulateKey, SharedSpecContext, testEmulateArrowAfterSelection, testEmulateArrows, testEmulateShiftArrows, testEmulateTab,
} from '@app/testing';
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

class AsyncEmulateKeyWrapper implements AsyncEmulateKey {
  private activeElement: WebElement;

  public readonly tab = {
    forwards: () => this.sendTabKey(Key.TAB),
    backwards: () => this.sendTabKey(Key.chord(Key.SHIFT, Key.TAB)),
    findSelectableElements: () => lookupSelectableElements(),
  };
  public readonly arrow = {
    up: () => this.sendKeys(Key.ARROW_UP),
    right: () =>  this.sendKeys(Key.ARROW_RIGHT),
    down: () => this.sendKeys(Key.ARROW_DOWN),
    left: () => this.sendKeys(Key.ARROW_LEFT),
  };
  public readonly shiftArrow = {
    up: () => this.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP)),
    right: () =>  this.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_RIGHT)),
    down: () => this.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_DOWN)),
    left: () => this.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_LEFT)),
  };
  public readonly shiftTab = () => this.sendTabKey(Key.chord(Key.SHIFT, Key.TAB));


  private async sendKeys(...args: Array<string|number|promise.Promise<string|number>>): Promise<void> {
    const activeElement = this.activeElement = this.activeElement || await browser.switchTo().activeElement();
    await activeElement.sendKeys(...args);
  }

  private async sendTabKey(key: string) {
    const activeElementBefore = this.activeElement =  this.activeElement || await (await browser.switchTo().activeElement());
    const activeElementIdBefore = await activeElementBefore.getId();
    await this.sendKeys(key);
    const activeElementafter = this.activeElement =  await browser.switchTo().activeElement();
    const activeElementIdAfter = await activeElementafter.getId();
    const preventedDefault = activeElementIdBefore !== activeElementIdAfter;
    return preventedDefault;
  }
}

describe('emulate key', () => {
  const context = {} as SharedSpecContext;

  beforeEach(async () => {
    await browser.get('/');
    context.app = await ProtractorHarnessEnvironment.loader().getHarness(AppHarness);
    context.emulateKey = new AsyncEmulateKeyWrapper();
  });

  beforeAll(async () => {
    await browser.get('/');
    await lookupSelectableElements();
  });

  describe('tab', () => testEmulateTab(context));

  if (process.env.capability_simulateArrowKeys) {
    describe('arrow', () => testEmulateArrows(context));
    describe('shift arrow', () => testEmulateShiftArrows(context));
    describe('arrow after selection', () => testEmulateArrowAfterSelection(context));
  }


  afterEach(async () => {
    expectNoErrorLogs();
  });
});
