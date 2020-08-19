import { TestElement } from '@angular/cdk/testing';
import { AppDemoFormHarness, AppHarness } from './app.harness';
import { AsyncEmulateKey, SharedSpecContext } from './shared-spec-context.model';
import { assertInitialSelectionRange } from './expect.function';

export function testEmulateArrowAfterSelection(
  context: SharedSpecContext,
) {
  let app: AppHarness;
  let emulateKey: AsyncEmulateKey;
  let demoForm: AppDemoFormHarness;

  beforeEach(async () => {
    app = context.app;
    emulateKey = context.emulateKey;
    demoForm = await app.getDemoFrom();
  });
  describe('right in input', () => {
    let textInput: TestElement;

    beforeEach(async () => {
      textInput = await demoForm.getControl('first input');
      await textInput.focus();
    });

    describe('that contains text', () => {
      beforeEach(async () => {
        await textInput.sendKeys('12345');
        await assertInitialSelectionRange(textInput, 5, 5);
      });

      describe('with selection forward', () => {
        describe('from middle to the end', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.right();
            await assertInitialSelectionRange(textInput, 4, 5, 'forward');
          });

          it('should only remove selection', async () => {
            await emulateKey.arrow.right();

            expect(await textInput.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toMatch(/forward|none/, 'selection direction');
          });
        });

        describe('from middle to middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await emulateKey.shiftArrow.right();
            await assertInitialSelectionRange(textInput, 1, 2, 'forward');
          });

          it('should remove selection', async () => {
            await emulateKey.arrow.right();
            expect(await textInput.getProperty('selectionStart')).toBe(2, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(2, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toMatch(/forward|none/, 'selection direction');
          });
        });
      });
    });
  });

  describe('left in input', () => {
    let textInput: TestElement;

    beforeEach(async () => {
      textInput = await demoForm.getControl('first input');
      await textInput.focus();
    });

    describe('that contains text', () => {
      beforeEach(async () => {
        await textInput.sendKeys('12345');
        await assertInitialSelectionRange(textInput, 5, 5);
      });

      describe('with selection forward', () => {
        describe('from middle to the end', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await emulateKey.shiftArrow.down();
            await assertInitialSelectionRange(textInput, 1, 5, 'forward');
          });

          it('should only remove selection', async () => {
            await emulateKey.arrow.left();

            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(1, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toMatch(/forward|none/, 'selection direction');
          });
        });

        describe('from middle to middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await emulateKey.shiftArrow.right();
            await assertInitialSelectionRange(textInput, 1, 2, 'forward');
          });

          it('should remove selection', async () => {
            await emulateKey.arrow.left();
            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(1, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toMatch(/forward|none/, 'selection direction');
          });
        });
      });
    });
  });
}
