import { AsyncEmulateKey } from '@app/testing';
import { WebElement, Key, browser, element, by, promise } from 'protractor';

// tslint:disable: member-ordering
export class ProtractorKeys implements AsyncEmulateKey {
  private activeElement: WebElement;

  async lookupSelectableElements() {
    await browser.executeScript(() => { document.body.focus(); });

    async function asSelectableElement(webElement: WebElement) {
      const id = await webElement.getAttribute('id');
      const tagName = await webElement.getTagName();
      const className = await webElement.getAttribute('class');
      return { id, tagName, className };
    }
    let activeElement = await browser.switchTo().activeElement();
    if (!activeElement) { return []; }

    const firstElement = await asSelectableElement(activeElement);
    const selectableElements = new Array<typeof firstElement>();
    selectableElements.push(firstElement);
    const hardLimit = 100;
    async function getNextElement() {
      await activeElement.sendKeys(Key.TAB);
      activeElement = await browser.switchTo().activeElement();
      const nextSelectableElement = await asSelectableElement(activeElement);
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

  readonly tab = {
    forwards: () => this.sendTabKey(Key.TAB),
    backwards: () => this.sendTabKey(Key.chord(Key.SHIFT, Key.TAB)),
    findSelectableElements: () => this.lookupSelectableElements(),
  };
  readonly arrow = {
    up: () => this.sendKeys(Key.ARROW_UP),
    right: () =>  this.sendKeys(Key.ARROW_RIGHT),
    down: () => this.sendKeys(Key.ARROW_DOWN),
    left: () => this.sendKeys(Key.ARROW_LEFT),
  };
  readonly shiftArrow = {
    up: () => this.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_UP)),
    right: () =>  this.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_RIGHT)),
    down: () => this.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_DOWN)),
    left: () => this.sendKeys(Key.chord(Key.SHIFT, Key.ARROW_LEFT)),
  };
  public readonly shiftTab = () => this.sendTabKey(Key.chord(Key.SHIFT, Key.TAB));

  public readonly backspace = () => this.sendKeys(Key.BACK_SPACE);
  public readonly delete = () => this.sendKeys(Key.DELETE);
  public readonly writeText = (keys: string) => this.sendKeys(keys);

  async getActiveElement() {
    if (this.activeElement) { return this.activeElement; }
    return this.activeElement = await browser.switchTo().activeElement();
  }

  private async sendKeys(...args: Array<string|number|promise.Promise<string|number>>): Promise<void> {
    const activeElement = await this.getActiveElement();
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
