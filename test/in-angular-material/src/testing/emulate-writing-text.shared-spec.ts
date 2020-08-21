import { TestElement } from '@angular/cdk/testing';
import { AppHarness, AppDemoFormHarness } from './app.harness';
import { assertInitialSelectionRange, assertInitialValue, expectSelectionRange, describeDoNothingInInputThatPreventsDefaults } from './expect.function';
import { AsyncEmulateKey, SharedSpecContext } from './shared-spec-context.model';

export function testEmulateWritingText(
  context: SharedSpecContext,
) {
  let app: AppHarness;
  let demoForm: AppDemoFormHarness;
  let emulateKey: AsyncEmulateKey;
  let textInput: TestElement;

  beforeEach(async () => {
    app = context.app;
    emulateKey = context.emulateKey;
    demoForm = await app.getDemoFrom();
    textInput = await demoForm.getControl('first input');
  });

  describe('in empty input', () => {
    beforeEach(async () => {
      await textInput.focus();
      await assertInitialValue(textInput, '');
    });

    it('should do nothing for empty string', async () => {
      await emulateKey.writeText('');

      expect(await textInput.getProperty('value')).toBe('');
    });

    it('should append keys to input value', async () => {
      await emulateKey.writeText('12345');

      expect(await textInput.getProperty('value')).toBe('12345');
    });
  });

  describe('in input with text', () => {
    beforeEach(async () => {
      await textInput.focus();
      await emulateKey.writeText('12345');
      await assertInitialValue(textInput, '12345');
    });

    describe('with cursor at the end', () => {
      beforeEach(async () => {
        await assertInitialSelectionRange(textInput, 5, 5);
      });

      it('should append characters', async () => {
        await emulateKey.writeText('67890');

        expect(await textInput.getProperty('value')).toBe('1234567890');
      });
    });

    describe('with cursor at start', () => {
      /* istanbul ignore if */
      if (process.env.bug_cannotSelectPos0) {
        pending(process.env.bug_cannotSelectPos0);
      }

      beforeEach(async () => {
        await context.setCursor(0);
        await assertInitialSelectionRange(textInput, 0, 0);
      });

      it('should insert single character at start', async () => {
        await emulateKey.writeText('6');

        expect(await textInput.getProperty('value')).toBe('612345');
        await expectSelectionRange(textInput, 1, 1, /forward|none/);
      });

      it('should insert multiple characters at start', async () => {
        await emulateKey.writeText('67890');

        expect(await textInput.getProperty('value')).toBe('6789012345');
        await expectSelectionRange(textInput, 5, 5, /forward|none/);
      });
    });

    describe('with cursor somewhere in the middle', () => {
      beforeEach(async () => {
        await context.setCursor(3);
        await assertInitialSelectionRange(textInput, 3, 3);
      });

      it('should insert multiple characters at cursor pos', async () => {
        await emulateKey.writeText('67890');

        expect(await textInput.getProperty('value')).toBe('1236789045');
        await expectSelectionRange(textInput, 8, 8, /forward|none/);
      });
    });

    describe('with selection somewhere in the middle', () => {
      beforeEach(async () => {
        context.setSelectionRange(2, 4, 'backward');
        await assertInitialSelectionRange(textInput, 2, 4);
      });

      it('should replace selected characters', async () => {
        await emulateKey.writeText('67890');

        expect(await textInput.getProperty('value')).toBe('12678905');
        await expectSelectionRange(textInput, 7, 7, /forward|none/);
      });
    });
  });

  describeDoNothingInInputThatPreventsDefaults(context, () => demoForm, () => emulateKey.writeText('abc'));
}
