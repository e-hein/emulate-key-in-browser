import { TestElement } from '@angular/cdk/testing';
import { AppDemoFormHarness, AppHarness } from './app.harness';
import { AsyncEmulateKey, SharedSpecContext } from './shared-spec-context.model';
import { assertInitialSelectionRange } from './expect.function';

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
    /* istanbul ignore if */
    if (process.env.bug_multipleArrows) {
      pending(process.env.bug_multipleArrows);
    }

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
      beforeEach(() =>  context.setValue('12345'));

      describe('without selection', () => {
        describe('with cursor at end', () => {
          beforeEach(() => context.setCursor(5));

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.right();

            expect(await textInput.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(() => context.setCursor(0));

          it('should select first character', async () => {
            await emulateKey.shiftArrow.right();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(1, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(() => context.setCursor(3));

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
          beforeEach(() => context.setSelectionRange(1, 5, 'forward'));

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.right();

            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('from middle to middle', () => {
          beforeEach(() => context.setSelectionRange(1, 2, 'forward'));

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
          beforeEach(() => context.setSelectionRange(0, 4, 'backward'));

          it('should reduce selection at selection start', async () => {
            await emulateKey.shiftArrow.right();

            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('one chars in the middle', () => {
          beforeEach(() => context.setSelectionRange(3, 4, 'backward'));

          it('should remove selection', async () => {
            await emulateKey.shiftArrow.right();
            expect(await textInput.getProperty('selectionStart')).toBe(4, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toMatch(/forward|none/, 'selection direction');
          });
        });

        describe('two chars in the middle', () => {
          beforeEach(() => context.setSelectionRange(2, 4, 'backward'));

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
    /* istanbul ignore if */
    if (process.env.bug_multipleArrows) {
      pending(process.env.bug_multipleArrows);
    }

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
      beforeEach(() => context.setValue('12345'));

      describe('without selection', () => {
        describe('with cursor at end', () => {
          beforeEach(() => context.setCursor(5));

          it('should select last character', async () => {
            await emulateKey.shiftArrow.left();

            expect(await textInput.getProperty('selectionStart')).toBe(4, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(() => context.setCursor(0));

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.left();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(() => context.setCursor(3));

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
          beforeEach(() => context.setSelectionRange(3, 5, 'forward'));

          it('should reduce selection at selection end', async () => {
            await emulateKey.shiftArrow.left();

            expect(await textInput.getProperty('selectionStart')).toBe(3, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('one characters in the middle', () => {
          beforeEach(() => context.setSelectionRange(1, 2, 'forward'));

          it('should remove selection', async () => {
            await emulateKey.shiftArrow.left();
            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(1, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toMatch(/forward|none/, 'selection direction');
          });
        });

        describe('multiple characters in the middle', () => {
          beforeEach(() => context.setSelectionRange(1, 3, 'forward'));

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
          beforeEach(() => context.setSelectionRange(0, 4, 'backward'));

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.left();

            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('from middle to middle', () => {
          beforeEach(() => context.setSelectionRange(3, 4, 'backward'));

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

  describe('up', () => {
    describe('in text input', () => {
      let textInput: TestElement;

      beforeEach(async () => {
        textInput = await demoForm.getControl('first input');
        await textInput.focus();
      });

      describe('that is empty', () => {
        it('should do nothing', async () => {
          await emulateKey.shiftArrow.up();

          expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
          expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
        });
      });

      describe('that contains text', () => {
        beforeEach(() => context.setValue('12345'));

        describe('with cursor at end', () => {
          beforeEach(() => context.setCursor(5));

          it('should select everything', async () => {
            await emulateKey.shiftArrow.up();

            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(() => context.setCursor(0));

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.up();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(() => context.setCursor(4));

          it('should select to the start', async () => {
            await emulateKey.shiftArrow.up();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });
      });
    });

    describe('in text area', () => {
      let textArea: TestElement;

      beforeEach(async () => {
        textArea = await demoForm.getControl('textarea');
        await textArea.focus();
      });

      describe('that is empty', () => {
        it('should do nothing', async () => {
          await emulateKey.shiftArrow.up();

          expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
          expect(await textArea.getProperty('selectionEnd')).toBe(0, 'selection end');
        });
      });

      describe('that contains text fitting in one row', () => {
        beforeEach(() => context.setValue('12345'));

        describe('with cursor at end', () => {
          beforeEach(() => context.setCursor(5));

          it('should select everything', async () => {
            await emulateKey.shiftArrow.up();

            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(() => context.setCursor(0));

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.up();
            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(0, 'selection end');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(() => context.setCursor(4));

          it('should cursor to the start', async () => {
            await emulateKey.shiftArrow.up();
            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(4, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });
      });

      describe('that contains multiple lines of text', () => {
        const oneLine = '12345678901234567';
        const multipleLines = oneLine + oneLine + oneLine;
        const initialCursorPos = multipleLines.length;

        beforeEach(async () => {
          await context.setValue(multipleLines);
        });

        describe('without initial selection', () => {
          beforeEach(() => context.setCursor(multipleLines.length));

          it('should select round about one line', async () => {
            await emulateKey.shiftArrow.up();

            expect(await textArea.getProperty('selectionStart')).toBeGreaterThan(oneLine.length, 'selection start > 0');
            expect(await textArea.getProperty('selectionStart')).toBeLessThan(multipleLines.length - 4, 'selection start < length');
            expect(await textArea.getProperty('selectionEnd')).toBe(multipleLines.length, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('with initial selection direction backward', () => {
          beforeEach(() => context.setSelectionRange(initialCursorPos - 3, initialCursorPos - 1, 'backward'));

          it('should extend selection about one line', async () => {
            await emulateKey.shiftArrow.up();

            expect(await textArea.getProperty('selectionStart')).toBeGreaterThan(oneLine.length, 'selection start > 0');
            expect(await textArea.getProperty('selectionStart')).toBeLessThan(initialCursorPos - 4, 'selection start < length');
            expect(await textArea.getProperty('selectionEnd')).toBe(initialCursorPos - 1, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('with initial selection direction forward and selected less than one line', () => {
          beforeEach(() => context.setSelectionRange(initialCursorPos - 3, initialCursorPos - 1, 'forward'));

          it('should remove selection', async () => {
            await emulateKey.shiftArrow.up();

            const selectionStart = await textArea.getProperty('selectionStart');
            const selectionEnd = await textArea.getProperty('selectionEnd');
            const selectionDirection = await textArea.getProperty('selectionDirection');

            const selectionRemoved = selectionStart === selectionEnd;
            const selectionInverted = selectionStart < selectionEnd - 3;

            /**
             * behavior variant a like e.g. chrome on mac os and windows
             */
            const behaviorVariantA = selectionRemoved && /forward|none/.test(selectionDirection);

            /**
             * behavior vairant b like e.g. firefox or chrome on linux
             */
            const behaviorVariantB = selectionInverted && selectionDirection === 'backward';

            const behaviorVariant = (behaviorVariantA && 'A') || (behaviorVariantB && 'B') || 'other';
            console.log('shift arrow up behaviorVariant: ' + behaviorVariant);

            expect(selectionEnd).toBe(initialCursorPos - 3, 'selection end');
            expect(behaviorVariant).toMatch(/[AB]/, JSON.stringify({
              selectionStart,
              selectionEnd,
              selectionDirection,
              selectionRemoved,
              selectionInverted,
            }));
          });
        });

        describe('with initial selection direction forward and selected more than one line', () => {
          beforeEach(async () => {
            await context.setSelectionRange(1, 3, 'forward');
            await emulateKey.shiftArrow.down();
          });

          it('should reduce selection at end', async () => {
            await emulateKey.shiftArrow.up();

            expect(await textArea.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(3, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });
      });
    });
  });

  describe('down', () => {
    describe('in text input', () => {
      let textInput: TestElement;

      beforeEach(async () => {
        textInput = await demoForm.getControl('first input');
        await textInput.focus();
      });

      describe('that is empty', () => {
        it('should do nothing', async () => {
          await emulateKey.shiftArrow.down();

          expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
          expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
        });
      });

      describe('that contains text', () => {
        beforeEach(() => context.setValue('12345'));

        describe('with cursor at end', () => {
          beforeEach(() => context.setCursor(5));

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.down();

            expect(await textInput.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(() => context.setCursor(0));

          it('should select everything', async () => {
            await emulateKey.shiftArrow.down();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(() => context.setCursor(1));

          it('should select to the end', async () => {
            await emulateKey.shiftArrow.down();
            expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });
      });
    });

    describe('in text area', () => {
      let textArea: TestElement;

      beforeEach(async () => {
        textArea = await demoForm.getControl('textarea');
        await textArea.focus();
      });

      describe('that is empty', () => {
        it('should do nothing', async () => {
          await emulateKey.shiftArrow.down();

          expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
          expect(await textArea.getProperty('selectionEnd')).toBe(0, 'selection end');
        });
      });

      describe('that contains text fitting in one row', () => {
        beforeEach(() => context.setValue('12345'));

        describe('with cursor at end', () => {
          beforeEach(() => context.setCursor(5));

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.down();

            expect(await textArea.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(() => context.setCursor(0));

          it('should select everything', async () => {
            await emulateKey.shiftArrow.down();
            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(() => context.setCursor(1));

          it('should cursor to the end', async () => {
            await emulateKey.shiftArrow.down();
            expect(await textArea.getProperty('selectionStart')).toBe(1, 'selection start (untouched)');
            expect(await textArea.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });
      });

      describe('that contains multiple lines of text', () => {
        const oneLine = '12345678901234567';
        const multipleLines = oneLine + oneLine + oneLine;
        const initialCursorPos = multipleLines.length;

        beforeEach(() => context.setValue(multipleLines));

        describe('without initial selection and cursor at start', () => {
          beforeEach(() => context.setCursor(0));

          it('should select round about one line', async () => {
            await emulateKey.shiftArrow.down();

            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBeGreaterThan(4, 'selection end > 0');
            expect(await textArea.getProperty('selectionEnd')).toBeLessThan(oneLine.length * 2 + 4, 'selection end < length');
            expect(await textArea.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('with initial selection direction forward', () => {
          beforeEach(() => context.setSelectionRange(1, 3, 'forward'));

          it('should extend selection about one line', async () => {
            await emulateKey.shiftArrow.down();

            expect(await textArea.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBeGreaterThan(3 + 4, 'selection end > 7');
            expect(await textArea.getProperty('selectionEnd')).toBeLessThan(3 + oneLine.length + 4, 'selection end < oneLine + 7');
            expect(await textArea.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('with initial selection direction backward and selected less than one line', () => {
          beforeEach(() => context.setSelectionRange(initialCursorPos - 3, initialCursorPos - 1, 'backward'));

          it('should remove selection', async () => {
            await emulateKey.shiftArrow.down();

            const selectionStart = await textArea.getProperty('selectionStart');
            const selectionEnd = await textArea.getProperty('selectionEnd');
            const selectionDirection = await textArea.getProperty('selectionDirection');

            const selectionRemoved = selectionStart === selectionEnd;
            const selectionInverted = selectionEnd === multipleLines.length;

            /**
             * behavior variant a like e.g. chrome on mac os and windows
             */
            const behaviorVariantA = selectionRemoved && /forward|none/.test(selectionDirection);

            /**
             * behavior vairant b like e.g. firefox or chrome on linux
             */
            const behaviorVariantB = selectionInverted && selectionDirection === 'forward';

            const behaviorVariant = (behaviorVariantA && 'A') || (behaviorVariantB && 'B') || 'other';
            console.log('shift arrow down behaviorVariant: ' + behaviorVariant);

            expect(selectionStart).toBe(initialCursorPos - 1, 'selection start');
            expect(behaviorVariant).toMatch(/[AB]/, JSON.stringify({
              selectionStart,
              selectionEnd,
              selectionDirection,
              selectionRemoved,
              selectionInverted,
            }));
          });
        });

        describe('with initial selection direction backward and selected more than one line', () => {
          beforeEach(async () => {
            await context.setSelectionRange(initialCursorPos - 3, initialCursorPos - 1, 'backward');

            await emulateKey.shiftArrow.up();
          });

          it('should reduce selection at end', async () => {
            await emulateKey.shiftArrow.down();

            expect(await textArea.getProperty('selectionStart')).toBe(initialCursorPos - 3, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(initialCursorPos - 1, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });
      });
    });
  });
}
