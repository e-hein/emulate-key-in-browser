import { TestElement } from '@angular/cdk/testing';
import { AppHarness } from './app.harness';
import { assertInitialSelectionRange, assertInitialValue } from './expect.function';
import { AsyncEmulateKey, SharedSpecContext } from './shared-spec-context.model';

export function testEmulateDelete(
  context: SharedSpecContext,
) {
  let emulateKey: AsyncEmulateKey;
  let textInput: TestElement;

  beforeEach(async () => {
    const app = context.app;
    emulateKey = context.emulateKey;
    const demoForm = await app.getDemoFrom();
    textInput = await demoForm.getControl('first input');
    await textInput.focus();
  });

  describe('in empty input', () => {
    beforeEach(async () => {
      await assertInitialValue(textInput, '');
    });

    it('should do nothing', async () => {
      await emulateKey.delete();

      expect(await textInput.getProperty('value')).toBe('');
    });
  });

  describe('in input with text', () => {
    beforeEach(() => context.setValue('12345'));

    describe('with cursor at the end', () => {
      beforeEach(() => context.setCursor(5));

      it('should do nothing', async () => {
        await emulateKey.delete();

        expect(await textInput.getProperty('value')).toBe('12345');
      });
    });

    describe('with cursor at start', () => {
      /* istanbul ignore if */
      if (process.env.bug_cannotSelectPos0) {
        pending(process.env.bug_cannotSelectPos0);
      }

      beforeEach(() => context.setCursor(0));

      it('should delete first character', async () => {
        await emulateKey.delete();

        expect(await textInput.getProperty('value')).toBe('2345');
      });
    });

    describe('with cursor somewhere in the middle', () => {
      beforeEach(() => context.setCursor(3));

      it('should delete character after cursor', async () => {
        await emulateKey.delete();

        expect(await textInput.getProperty('value')).toBe('1235');
      });
    });

    describe('with selection somewhere in the middle', () => {
      beforeEach(() => context.setSelectionRange(2, 4, 'backward'));

      it('should delete selected characters', async () => {
        await emulateKey.delete();

        expect(await textInput.getProperty('value')).toBe('125');
      });
    });
  });
}
