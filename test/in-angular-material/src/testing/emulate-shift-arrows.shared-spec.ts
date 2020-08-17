import { TestElement } from '@angular/cdk/testing';
import { AppDemoFormHarness, AppHarness } from './app.harness';
import { AsyncEmulateKey, SharedSpecContext } from './shared-spec-context.model';
import { ensureInitialSelectionRange } from './expect.function';

export function testEmulateShiftArrows(
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

    describe('that is empty', () => {
      it('should do nothing', async () => {
        await emulateKey.shiftArrow.right();

        expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
        expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
      });
    });

    describe('that contains text', () => {
      beforeEach(async () => {
        await textInput.sendKeys('12345');
        await ensureInitialSelectionRange(textInput, 5, 5);
      });

      describe('without selection', () => {
        describe('with cursor at end', () => {
          it('should do nothing', async () => {
            await emulateKey.shiftArrow.right();

            expect(await textInput.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await ensureInitialSelectionRange(textInput, 0, 0);
          });

          it('should select first character', async () => {
            await emulateKey.shiftArrow.right();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(1, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.arrow.left();
            await ensureInitialSelectionRange(textInput, 3, 3);
          });

          it('should select next character', async () => {
            await emulateKey.shiftArrow.right();
            expect(await textInput.getProperty('selectionStart')).toBe(3, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });
      });

      describe('with selection forward', () => {
        describe('from middle to the end', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await emulateKey.shiftArrow.down();
            await ensureInitialSelectionRange(textInput, 1, 5, 'forward');
          });

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.right();

            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('from middle to middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await emulateKey.shiftArrow.right();
            await ensureInitialSelectionRange(textInput, 1, 2, 'forward');
          });

          it('should extend selection at the end of selection', async () => {
            await emulateKey.shiftArrow.right();
            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(3, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });
      });

      describe('with existing selection backward', () => {
        describe('from middle to the start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.up();
            await ensureInitialSelectionRange(textInput, 0, 4, 'backward');
          });

          it('should reduce selection at selection start', async () => {
            await emulateKey.shiftArrow.right();

            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('one chars in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.left();
            await ensureInitialSelectionRange(textInput, 3, 4, 'backward');
          });

          it('should remove selection', async () => {
            await emulateKey.shiftArrow.right();
            expect(await textInput.getProperty('selectionStart')).toBe(4, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toMatch(/forward|none/, 'selection direction');
          });
        });

        describe('two chars in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.left();
            await emulateKey.shiftArrow.left();
            await ensureInitialSelectionRange(textInput, 2, 4, 'backward');
          });

          it('should reduce selection at selection start', async () => {
            await emulateKey.shiftArrow.right();
            expect(await textInput.getProperty('selectionStart')).toBe(3, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
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

    describe('that is empty', () => {
      it('should do nothing', async () => {
        await emulateKey.shiftArrow.left();

        expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
        expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
      });
    });

    describe('that contains text', () => {
      beforeEach(async () => {
        await textInput.sendKeys('12345');
        await ensureInitialSelectionRange(textInput, 5, 5);
      });

      describe('without selection', () => {
        describe('with cursor at end', () => {
          it('should select last character', async () => {
            await emulateKey.shiftArrow.left();

            expect(await textInput.getProperty('selectionStart')).toBe(4, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await ensureInitialSelectionRange(textInput, 0, 0);
          });

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.left();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.arrow.left();
            await ensureInitialSelectionRange(textInput, 3, 3);
          });

          it('should select previous character', async () => {
            await emulateKey.shiftArrow.left();
            expect(await textInput.getProperty('selectionStart')).toBe(2, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(3, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });
      });

      describe('with existing selection forward', () => {
        describe('from middle to the end', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.down();
            await ensureInitialSelectionRange(textInput, 3, 5, 'forward');
          });

          it('should reduce selection at selection end', async () => {
            await emulateKey.shiftArrow.left();

            expect(await textInput.getProperty('selectionStart')).toBe(3, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('one characters in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await emulateKey.shiftArrow.right();
            await ensureInitialSelectionRange(textInput, 1, 2, 'forward');
          });

          it('should remove selection', async () => {
            await emulateKey.shiftArrow.left();
            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(1, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toMatch(/forward|none/, 'selection direction');
          });
        });

        describe('multiple characters in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await emulateKey.shiftArrow.right();
            await emulateKey.shiftArrow.right();
            await ensureInitialSelectionRange(textInput, 1, 3, 'forward');
          });

          it('should reduce selection at selection end', async () => {
            await emulateKey.shiftArrow.left();
            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(2, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });
      });

      describe('with existing selection backward', () => {
        describe('from middle to the start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.up();
            await ensureInitialSelectionRange(textInput, 0, 4, 'backward');
          });

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.left();

            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('from middle to middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.left();
            await ensureInitialSelectionRange(textInput, 3, 4, 'backward');
          });

          it('should reduce selection at selection end', async () => {
            await emulateKey.shiftArrow.left();
            expect(await textInput.getProperty('selectionStart')).toBe(2, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });
      });
    });
  });
}
