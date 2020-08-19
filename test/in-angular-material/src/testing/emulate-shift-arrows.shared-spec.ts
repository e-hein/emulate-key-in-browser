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
        await assertInitialSelectionRange(textInput, 5, 5);
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
            await assertInitialSelectionRange(textInput, 0, 0);
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
            await assertInitialSelectionRange(textInput, 3, 3);
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
            await assertInitialSelectionRange(textInput, 1, 5, 'forward');
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
            await assertInitialSelectionRange(textInput, 1, 2, 'forward');
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
            await assertInitialSelectionRange(textInput, 0, 4, 'backward');
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
            await assertInitialSelectionRange(textInput, 3, 4, 'backward');
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
            await assertInitialSelectionRange(textInput, 2, 4, 'backward');
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
        await assertInitialSelectionRange(textInput, 5, 5);
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
            await assertInitialSelectionRange(textInput, 0, 0);
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
            await assertInitialSelectionRange(textInput, 3, 3);
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
            await assertInitialSelectionRange(textInput, 3, 5, 'forward');
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
            await assertInitialSelectionRange(textInput, 1, 2, 'forward');
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
            await assertInitialSelectionRange(textInput, 1, 3, 'forward');
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
            await assertInitialSelectionRange(textInput, 0, 4, 'backward');
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
            await assertInitialSelectionRange(textInput, 3, 4, 'backward');
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
        beforeEach(async () => {
          await textInput.sendKeys('12345');
          await assertInitialSelectionRange(textInput, 5, 5);
        });

        describe('with cursor at end', () => {
          it('should select everything', async () => {
            await emulateKey.shiftArrow.up();

            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await assertInitialSelectionRange(textInput, 0, 0);
          });

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.up();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await assertInitialSelectionRange(textInput, 4, 4);
          });

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
        beforeEach(async () => {
          await textArea.sendKeys('12345');
          await assertInitialSelectionRange(textArea, 5, 5);
        });

        describe('with cursor at end', () => {
          it('should select everything', async () => {
            await emulateKey.shiftArrow.up();

            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await assertInitialSelectionRange(textArea, 0, 0);
          });

          it('should do nothing', async () => {
            await emulateKey.shiftArrow.up();
            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(0, 'selection end');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await assertInitialSelectionRange(textArea, 4, 4);
          });

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
          await textArea.sendKeys(multipleLines);
          await assertInitialSelectionRange(textArea, initialCursorPos, initialCursorPos);
        });

        describe('without initial selection', () => {
          it('should select round about one line', async () => {
            await emulateKey.shiftArrow.up();

            expect(await textArea.getProperty('selectionStart')).toBeGreaterThan(oneLine.length, 'selection start > 0');
            expect(await textArea.getProperty('selectionStart')).toBeLessThan(multipleLines.length - 4, 'selection start < length');
            expect(await textArea.getProperty('selectionEnd')).toBe(multipleLines.length, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('with initial selection direction backward', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.left();
            await emulateKey.shiftArrow.left();

            await assertInitialSelectionRange(textArea, initialCursorPos - 3, initialCursorPos - 1, 'backward');
          });

          it('should extend selection about one line', async () => {
            await emulateKey.shiftArrow.up();

            expect(await textArea.getProperty('selectionStart')).toBeGreaterThan(oneLine.length, 'selection start > 0');
            expect(await textArea.getProperty('selectionStart')).toBeLessThan(initialCursorPos - 4, 'selection start < length');
            expect(await textArea.getProperty('selectionEnd')).toBe(initialCursorPos - 1, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('backward', 'selection direction');
          });
        });

        describe('with initial selection direction forward and selected less than one line', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.arrow.left();
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.right();
            await emulateKey.shiftArrow.right();

            await assertInitialSelectionRange(textArea, initialCursorPos - 3, initialCursorPos - 1, 'forward');
          });

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
            await emulateKey.arrow.up();
            await emulateKey.arrow.up();
            await emulateKey.arrow.up();
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await emulateKey.shiftArrow.right();
            await emulateKey.shiftArrow.right();
            await assertInitialSelectionRange(textArea, 1, 3, 'forward');

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
        beforeEach(async () => {
          await textInput.sendKeys('12345');
          await assertInitialSelectionRange(textInput, 5, 5);
        });

        describe('with cursor at end', () => {
          it('should do nothing', async () => {
            await emulateKey.shiftArrow.down();

            expect(await textInput.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await assertInitialSelectionRange(textInput, 0, 0);
          });

          it('should select everything', async () => {
            await emulateKey.shiftArrow.down();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textInput.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await assertInitialSelectionRange(textInput, 1, 1);
          });

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
        beforeEach(async () => {
          await textArea.sendKeys('12345');
          await assertInitialSelectionRange(textArea, 5, 5);
        });

        describe('with cursor at end', () => {
          it('should do nothing', async () => {
            await emulateKey.shiftArrow.down();

            expect(await textArea.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await assertInitialSelectionRange(textArea, 0, 0);
          });

          it('should select everything', async () => {
            await emulateKey.shiftArrow.down();
            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(5, 'selection end');
            expect(await textArea.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await assertInitialSelectionRange(textArea, 1, 1);
          });

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

        beforeEach(async () => {
          await textArea.sendKeys(multipleLines);
          await assertInitialSelectionRange(textArea, initialCursorPos, initialCursorPos);
        });

        describe('without initial selection and cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.up();
            await emulateKey.arrow.up();
            await emulateKey.arrow.up();
            await assertInitialSelectionRange(textArea, 0, 0);
          });

          it('should select round about one line', async () => {
            await emulateKey.shiftArrow.down();

            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBeGreaterThan(4, 'selection end > 0');
            expect(await textArea.getProperty('selectionEnd')).toBeLessThan(oneLine.length * 2, 'selection end < length');
            expect(await textArea.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('with initial selection direction forward', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await emulateKey.arrow.up();
            await emulateKey.arrow.up();
            await emulateKey.arrow.up();
            await emulateKey.arrow.right();
            await emulateKey.shiftArrow.right();
            await emulateKey.shiftArrow.right();

            await assertInitialSelectionRange(textArea, 1, 3, 'forward');
          });

          it('should extend selection about one line', async () => {
            await emulateKey.shiftArrow.down();

            expect(await textArea.getProperty('selectionStart')).toBe(1, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBeGreaterThan(3 + 4, 'selection end > 7');
            expect(await textArea.getProperty('selectionEnd')).toBeLessThan(3 + oneLine.length + 4, 'selection end < oneLine + 7');
            expect(await textArea.getProperty('selectionDirection')).toBe('forward', 'selection direction');
          });
        });

        describe('with initial selection direction backward and selected less than one line', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.left();
            await emulateKey.shiftArrow.left();

            await assertInitialSelectionRange(textArea, initialCursorPos - 3, initialCursorPos - 1, 'backward');
          });

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
            await emulateKey.arrow.left();
            await emulateKey.shiftArrow.left();
            await emulateKey.shiftArrow.left();
            await assertInitialSelectionRange(textArea, initialCursorPos - 3, initialCursorPos - 1, 'backward');

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
