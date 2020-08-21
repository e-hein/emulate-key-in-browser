import { AppControlsHarness, AppDemoFormHarness } from './app.harness';
import { expectNotToHaveThrownAnything } from './expect.function';
import { AsyncEmulateKey, SharedSpecContext } from './shared-spec-context.model';

const envSpecificTabableElements = [
  'a.jasmine-title',  // protractor tests real browser window, so it can't find jasmine frame border
  'body.mat-typography', // protractor tabs out of website, so body will get the active element (Todo: should get emulated?)
];

/** Todo: merge this spec into emulate tab and test only integration, here */
export function testEmulateTab(
  context: SharedSpecContext,
) {
  describe('emulate tab', () => {
    let demoForm: AppDemoFormHarness;
    let controls: AppControlsHarness;
    let emulateKey: AsyncEmulateKey;

    beforeEach(async () => {
      emulateKey = context.emulateKey;
      const app = context.app;
      demoForm = await app.getDemoFrom();
      controls = await app.getControls();
    });

    it('should start', () => expectNotToHaveThrownAnything());

    it('should find selectable inputs', async () => {
      const selectableElementIds = await emulateKey.tab.findSelectableElements();
      expect(selectableElementIds.map((e) => {
        return (e.id && ('#' + e.id)) || (e.tagName.toLowerCase() + '.' + e.className);
      }).filter((ident) => !envSpecificTabableElements.includes(ident))).toEqual([
        '#first-input',
        '#second-input',
        '#textarea',
        '#button',
      ]);
    });

    it('backwards', async () => {
      // given
      const firstInput = await demoForm.getControl('first input');
      const secondInput = await demoForm.getControl('second input');
      await secondInput.focus();

      // when
      await emulateKey.tab.backwards();

      // then
      expect(await firstInput.isFocused()).toBe(true);
    });

    it('forwards', async () => {
      // given
      const firstInput = await demoForm.getControl('first input');
      const secondInput = await demoForm.getControl('second input');
      await firstInput.focus();

      // when
      await emulateKey.tab.forwards();

      // then
      expect(await secondInput.isFocused()).toBe(true);
    });

    it('tab into single line input with value should select everything', async () => {
      // given
      const firstInput =  await demoForm.getControl('first input');
      const secondInput = await demoForm.getControl('second input');
      await secondInput.sendKeys('something');
      await firstInput.focus();

      // when
      await emulateKey.tab.forwards();

      // then
      expect(await secondInput.isFocused()).toBe(true, 'second input has no focus');
      expect(await secondInput.getProperty('selectionStart')).toBe(0, 'selection start');
      expect(await secondInput.getProperty('selectionEnd')).toBeGreaterThan(0, 'selection end');
    });

    it('tab into multi line input with value should set cursor to the end of the input', async () => {
      // given
      const button = await demoForm.getControl('button');
      const textarea =  await demoForm.getControl('textarea');
      await textarea.sendKeys('something');
      await button.focus();

      // when
      await emulateKey.tab.backwards();

      // then
      expect(await textarea.isFocused()).toBe(true, 'textarea has no focus');
      const selectionStart: number = await textarea.getProperty('selectionStart');
      const selectionEnd: number = await textarea.getProperty('selectionEnd');
      const value: string = await textarea.getProperty('value');

      expect(selectionStart).toBe(value.length, 'cursor not at the end');
      expect(selectionStart).toBe(selectionEnd, 'selected something');
    });

    it('should not tab out of input that prevents default', async () => {
      const input = await demoForm.getControl('prevent default');
      await input.focus();

      await emulateKey.shiftTab();

      expect(await input.isFocused()).toBe(true);
    });
  });
}
