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

    it('tab into input with value should select everything', async () => {
      // given
      const firstInput =  await demoForm.getControl('first input');
      const secondInput = await demoForm.getControl('second input');
      await secondInput.sendKeys('something');
      await firstInput.focus();

      // when
      await emulateKey.tab.forwards();

      // then
      expect(await secondInput.isFocused()).toBe(true, 'second input has focus');
      expect(await secondInput.getProperty('selectionStart')).toBe(0, 'selection start');
      expect(await secondInput.getProperty('selectionEnd')).toBeGreaterThan(0, 'selection end');
    });
  });
}
