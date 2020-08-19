import { TestElement } from '@angular/cdk/testing';
import { AppDemoFormHarness, AppHarness } from './app.harness';
import { AsyncEmulateKey, SharedSpecContext } from './shared-spec-context.model';
import { assertInitialSelectionRange } from './expect.function';

export function testEmulateArrows(
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

  describe('arrow up', () => {
    describe('in text input', () => {
      let textInput: TestElement;

      beforeEach(async () => {
        textInput = await demoForm.getControl('first input');
        await textInput.focus();
      });

      describe('that is empty', () => {
        it('should do nothing', async () => {
          await emulateKey.arrow.up();

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
          it('should move cursor to the start', async () => {
            await emulateKey.arrow.up();

            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await assertInitialSelectionRange(textInput, 0, 0);
          });

          it('should do nothing', async () => {
            await emulateKey.arrow.up();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await assertInitialSelectionRange(textInput, 4, 4);
          });

          it('should cursor to the start', async () => {
            await emulateKey.arrow.up();
            expect(await textInput.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(0, 'selection end');
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
          await emulateKey.arrow.up();

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
          it('should move cursor to the start', async () => {
            await emulateKey.arrow.up();

            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(0, 'selection end');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await assertInitialSelectionRange(textArea, 0, 0);
          });

          it('should do nothing', async () => {
            await emulateKey.arrow.up();
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
            await emulateKey.arrow.up();
            expect(await textArea.getProperty('selectionStart')).toBe(0, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(0, 'selection end');
          });
        });
      });

      describe('that contains multiple lines of text', () => {
        const oneLine = '12345678901234567';
        const multipleLines = oneLine + oneLine + oneLine;
        beforeEach(async () => {
          await textArea.sendKeys(multipleLines);
          await assertInitialSelectionRange(textArea, multipleLines.length, multipleLines.length);
        });

        it('should move round about one line', async () => {
          await emulateKey.arrow.up();

          expect(await textArea.getProperty('selectionStart')).toBeGreaterThan(oneLine.length, 'selection start > 0');
          expect(await textArea.getProperty('selectionEnd')).toBeGreaterThan(oneLine.length, 'selection end > 0');

          expect(await textArea.getProperty('selectionStart')).toBeLessThan(multipleLines.length - 4, 'selection start < length');
          expect(await textArea.getProperty('selectionEnd')).toBeLessThan(multipleLines.length - 4, 'selection end < length');
        });
      });
    });
  });

  describe('arrow down', () => {
    describe('in text input', () => {
      let textInput: TestElement;

      beforeEach(async () => {
        textInput = await demoForm.getControl('first input');
        await textInput.focus();
      });

      describe('that is empty', () => {
        it('should do nothing', async () => {
          await emulateKey.arrow.down();

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
            await emulateKey.arrow.down();

            expect(await textInput.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await assertInitialSelectionRange(textInput, 0, 0);
          });

          it('should move cursor to the end of text', async () => {
            await emulateKey.arrow.down();
            expect(await textInput.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.arrow.left();
            await assertInitialSelectionRange(textInput, 3, 3);
          });

          it('should cursor to the end of text', async () => {
            await emulateKey.arrow.down();
            expect(await textInput.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
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
          await emulateKey.arrow.down();

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
            await emulateKey.arrow.down();

            expect(await textArea.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });

        describe('with cursor at start', () => {
          beforeEach(async () => {
            await emulateKey.arrow.up();
            await assertInitialSelectionRange(textArea, 0, 0);
          });

          it('should move cursor to the end of text', async () => {
            await emulateKey.arrow.down();
            expect(await textArea.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });

        describe('with cursor somewhere in the middle', () => {
          beforeEach(async () => {
            await emulateKey.arrow.left();
            await emulateKey.arrow.left();
            await assertInitialSelectionRange(textArea, 3, 3);
          });

          it('should move cursor to the end of text', async () => {
            await emulateKey.arrow.down();
            expect(await textArea.getProperty('selectionStart')).toBe(5, 'selection start');
            expect(await textArea.getProperty('selectionEnd')).toBe(5, 'selection end');
          });
        });
      });

      describe('that contains multiple lines of text', () => {
        const oneLine = '12345678901234567';
        const multipleLines = oneLine + oneLine + oneLine;
        beforeEach(async () => {
          await textArea.sendKeys(multipleLines);
          await emulateKey.arrow.up();
          await emulateKey.arrow.up();
          await emulateKey.arrow.up();
          await emulateKey.arrow.up();
          await assertInitialSelectionRange(textArea, 0, 0);
        });

        it('should move round about one line', async () => {
          await emulateKey.arrow.down();

          expect(await textArea.getProperty('selectionStart')).toBeGreaterThan(4, 'selection start > 0');
          expect(await textArea.getProperty('selectionEnd')).toBeGreaterThan(4, 'selection end > 0');

          expect(await textArea.getProperty('selectionStart')).toBeLessThan(multipleLines.length - oneLine.length, 'selection start < length');
          expect(await textArea.getProperty('selectionEnd')).toBeLessThan(multipleLines.length - oneLine.length, 'selection end < length');
        });
      });
    });
  });

  describe('arrow right in input', () => {
    let textInput: TestElement;

    beforeEach(async () => {
      textInput = await demoForm.getControl('first input');
      await textInput.focus();
    });

    describe('that is empty', () => {
      it('should do nothing', async () => {
        await emulateKey.arrow.right();

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
          await emulateKey.arrow.right();

          expect(await textInput.getProperty('selectionStart')).toBe(5, 'selection start');
          expect(await textInput.getProperty('selectionEnd')).toBe(5, 'selection end');
        });
      });

      describe('with cursor at start', () => {
        beforeEach(async () => {
          await emulateKey.arrow.up();
          await assertInitialSelectionRange(textInput, 0, 0);
        });

        it('should move cursor to the next (right) character', async () => {
          await emulateKey.arrow.right();
          expect(await textInput.getProperty('selectionStart')).toBe(1, 'selection start');
          expect(await textInput.getProperty('selectionEnd')).toBe(1, 'selection end');
        });
      });

      describe('with cursor somewhere in the middle', () => {
        beforeEach(async () => {
          await emulateKey.arrow.left();
          await emulateKey.arrow.left();
          await assertInitialSelectionRange(textInput, 3, 3);
        });

        it('should cursor to the next character', async () => {
          await emulateKey.arrow.right();
          expect(await textInput.getProperty('selectionStart')).toBe(4, 'selection start');
          expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
        });
      });
    });
  });

  describe('arrow left in input', () => {
    let textInput: TestElement;

    beforeEach(async () => {
      textInput = await demoForm.getControl('first input');
      await textInput.focus();
    });

    describe('that is empty', () => {
      it('should do nothing', async () => {
        await emulateKey.arrow.left();

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
        it('should move cursor one character left', async () => {
          await emulateKey.arrow.left();

          expect(await textInput.getProperty('selectionStart')).toBe(4, 'selection start');
          expect(await textInput.getProperty('selectionEnd')).toBe(4, 'selection end');
        });
      });

      describe('with cursor at start of text', () => {
        beforeEach(async () => {
          await emulateKey.arrow.up();
          await assertInitialSelectionRange(textInput, 0, 0);
        });

        it('should do nothing', async () => {
          await emulateKey.arrow.left();
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

        it('should cursor to the next character', async () => {
          await emulateKey.arrow.left();
          expect(await textInput.getProperty('selectionStart')).toBe(2, 'selection start');
          expect(await textInput.getProperty('selectionEnd')).toBe(2, 'selection end');
        });
      });
    });
  });
}
