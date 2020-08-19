import { TestElement } from '@angular/cdk/testing';
import { AppHarness } from './app.harness';
import { assertInitialSelectionRange, assertValue } from './expect.function';
import { AsyncEmulateKey, SharedSpecContext } from './shared-spec-context.model';

export function testEmulateBackspace(
  context: SharedSpecContext,
) {
  let app: AppHarness;
  let emulateKey: AsyncEmulateKey;
  let textInput: TestElement;

  beforeEach(async () => {
    app = context.app;
    emulateKey = context.emulateKey;
    const demoForm = await app.getDemoFrom();
    textInput = await demoForm.getControl('first input');
  });

  describe('in empty input', () => {
    beforeEach(async () => {
      await assertValue(textInput, '');
    });

    it('should do nothing', async () => {
      await emulateKey.backspace();

      expect(await textInput.getProperty('value')).toBe('');
    });
  });

  describe('in input with text', () => {
    beforeEach(async () => {
      await textInput.sendKeys('12345');
      await assertValue(textInput, '12345');
    });

    describe('with cursor at the end', () => {
      beforeEach(async () => {
        await assertInitialSelectionRange(textInput, 5, 5);
      });
      it('should remove the last character', async () => {
        await emulateKey.backspace();

        expect(await textInput.getProperty('value')).toBe('1234');
      });
    });

    describe('with cursor at start', () => {
      beforeEach(async () => {
        emulateKey.arrow.up();
        await assertInitialSelectionRange(textInput, 0, 0);
      });

      it('should do nothing', async () => {
        await emulateKey.backspace();

        expect(await textInput.getProperty('value')).toBe('12345');
      });
    });

    describe('with cursor somewhere in the middle', () => {
      beforeEach(async () => {
        emulateKey.arrow.left();
        emulateKey.arrow.left();
        await assertInitialSelectionRange(textInput, 3, 3);
      });

      it('should delete character before cursor', async () => {
        await emulateKey.backspace();

        expect(await textInput.getProperty('value')).toBe('1245');
      });
    });

    describe('with selection somewhere in the middle', () => {
      beforeEach(async () => {
        emulateKey.arrow.left();
        emulateKey.shiftArrow.left();
        emulateKey.shiftArrow.left();
        await assertInitialSelectionRange(textInput, 2, 4);
      });

      it('should delete selected characters', async () => {
        await emulateKey.backspace();

        expect(await textInput.getProperty('value')).toBe('125');
      });
    });
  });
}
