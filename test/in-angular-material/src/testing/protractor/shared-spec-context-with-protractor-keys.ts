import { ProtractorHarnessEnvironment } from '@angular/cdk/testing/protractor';
import { AppHarness, AsyncEmulateKey, SharedSpecContext } from '@app/testing';
import { browser } from 'protractor';
import { ProtractorKeys } from './protractor-keys';

export class SharedSpecContextWithProtractorKeys implements SharedSpecContext {
  emulateKey: AsyncEmulateKey;
  app: AppHarness;

  async refreshContext() {
    this.app = await ProtractorHarnessEnvironment.loader().getHarness(AppHarness);
    this.emulateKey = new ProtractorKeys();
  }

  async setSelectionRange(start: number, end: number, direction: 'forward' | 'backward' | 'none') {
    await browser.driver.executeScript((
      startToSet: number, endToSet: number, directionToSet: 'forward' | 'backward' | 'none',
    ) => {
      const target = document.activeElement as HTMLInputElement;
      if (!target) {
        throw new Error('no active input');
      }
      target.setSelectionRange(startToSet, endToSet, directionToSet);
    }, start, end, direction);
  }

  async setCursor(pos: number) {
    await this.setSelectionRange(pos, pos, 'forward');
  }

  async setValue(value: string | null) {
    await browser.driver.executeScript(
      (valueToSet: string) => {
        const target = document.activeElement as HTMLInputElement;
        if (!target) {
          throw new Error('no active input');
        }
        target.value = valueToSet;
      }, value,
    );
  }

  takeScreenshot(ident: string) {
    return browser.imageComparison.checkScreen(ident, { /* some options*/ });
  }

  async getActiveElementId() {
    return browser.driver.executeScript<string | undefined>(() => document.activeElement?.id);
  }
}
