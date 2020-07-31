import type { emulateKey as origEmulateKey } from 'emulate-key-in-browser';
import { AppControlsHarness, AppDemoFormHarness, AppHarness } from './app.harness';
import { expectNotToHaveThrownAnything } from './expect.function';

export function testEmulateTab(
  appProvider: () => AppHarness,
  emulateKey: typeof origEmulateKey,
) {
  describe('emulate tab', () => {
    let demoForm: AppDemoFormHarness;
    let controls: AppControlsHarness;

    function findAllSelectableIdents() {
      const selectableElements = emulateKey.tab.findSelectableElements();
      const selectableElementIdents = selectableElements.map((e) => (e.id && '#' + e.id) || e.title || e.className);
      // console.log('selectableElements', selectableElementIdents);
      return selectableElementIdents;
    }

    beforeEach(async () => {
      const app = appProvider();
      demoForm = await app.getDemoFrom();
      controls = await app.getControls();
    });

    it('should start', () => expectNotToHaveThrownAnything());

    it('should find selectable inputs', () => {
      const selectableElementIds = findAllSelectableIdents();
      expect(selectableElementIds.filter((id) => id !== 'jasmine-title')).toEqual([
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
      await emulateKey.tab();

      // then
      expect(await secondInput.isFocused()).toBe(true, 'second input has focus');
      expect(await secondInput.getProperty('selectionStart')).toBe(0, 'selection start');
      expect(await secondInput.getProperty('selectionEnd')).toBeGreaterThan(0, 'selection end');
    });
  });
}
