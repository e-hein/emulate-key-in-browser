import { SharedSpecContext } from './shared-spec-context.model';
import { TestElement } from '@angular/cdk/testing';
import { AppDemoFormHarness } from './app.harness';
import { assertInitialValue, expectSelectionRange } from './expect.function';

export function testSharedSpecContext(
  context: SharedSpecContext,
) {
  it('should contain app harness', () => expect(context.app).toBeTruthy());
  it('should contain emulateKey wrapper', () => expect(context.emulateKey).toBeTruthy());
  describe('in demo form', () => {
    let demoForm: AppDemoFormHarness;

    beforeEach(async () => demoForm = await context.app.getDemoFrom());

    it('that should be present', () => expect(demoForm).toBeTruthy());

    describe('first input', () => {
      let textInput: TestElement;

      beforeEach(async () => textInput = await demoForm.getControl('first input'));

      it('that should be present', () => expect(textInput).toBeTruthy());

      it('should be able to set value of first input', async () => {
        await textInput.focus();
        await context.setValue('12345');
        expect(await textInput.getProperty('value')).toBe('12345');
      });

      describe('with value "12345"', () => {
        beforeEach(async () => {
          await textInput.focus();
          await context.setValue('12345');
          assertInitialValue(textInput, '12345');
        });


        it('should be able to set cursor', async () => {
          await context.setCursor(3);

          await expectSelectionRange(textInput, 3, 3, /forward|none/);
        });

        it('should be able to set selection forward', async () => {
          await context.setSelectionRange(1, 3, 'forward');

          await expectSelectionRange(textInput, 1, 3, 'forward');
        });

        it('should be able to set selection backward', async () => {
          await context.setSelectionRange(1, 3, 'backward');

          await expectSelectionRange(textInput, 1, 3, 'backward');
        });
      });
    });

    describe('with input that prevents default', () => {
      let input: TestElement;

      beforeEach(async () => {
        input = await demoForm.getControl('prevent default');
        await input.focus();
      });

      it('should be able to set value', async () => {
        await context.setValue('12345');
        expect(await input.getProperty('value')).toBe('12345');
      });

      it('should be able to selection range', async () => {
        await context.setValue('12345');
        await context.setSelectionRange(2, 4, 'backward');

        await expectSelectionRange(input, 2, 4, 'backward');
      });
    });
  });
}
