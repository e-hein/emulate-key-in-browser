import { TestBed } from '@angular/core/testing';
import {
  AppDemoFormHarness, assertInitialSelectionRange, assertInitialValue,
  describeDoNothingInInputThatPreventsDefaults, expectSelectionRange, expectNotToHaveThrownAnything,
} from '@app/testing';
import { getCurrentSpecResult, SharedSpecContextWithFixture } from '@app/testing/testbed';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('expect funtioncs', () => {
  const context = new SharedSpecContextWithFixture();
  let demoForm: AppDemoFormHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
    await context.updateFixture(TestBed.createComponent(AppComponent));
    demoForm = await context.app.getDemoFrom();
  });

  describe('assertInitialSelectionRange', () => {
    it ('should not throw if selection range matches expected range and direction', async () => {
      const input = await demoForm.getControl('second input');
      await input.focus();
      await context.setValue('12345');
      await context.setCursor(3);

      try {
        await assertInitialSelectionRange(input, 3, 3);
        expectNotToHaveThrownAnything();
      } catch (e) {
        fail('did throw: ' + e.message);
      }
    });

    it ('should throw if selection range isn\'t expected selection range', async () => {
      const input = await demoForm.getControl('second input');
      await input.focus();
      await context.setValue('12345');
      await context.setSelectionRange(2, 4, 'backward');

      try {
        await assertInitialSelectionRange(input, 2, 5);
        fail('did not throw');
      } catch (e) {
        expect(e.message).toMatch(/selection/);
      }
    });

    describe('with given selection direction', () => {
      it ('should not thow if direction matches', async () => {
        const input = await demoForm.getControl('second input');
        await input.focus();
        await context.setValue('12345');
        await context.setSelectionRange(2, 4, 'forward');

        try {
          await assertInitialSelectionRange(input, 2, 4, 'forward');
          expectNotToHaveThrownAnything();
        } catch (e) {
          fail('did throw: ' + e.message);
        }
      });

      it ('should thow if direction does not match', async () => {
        const input = await demoForm.getControl('second input');
        await input.focus();
        await context.setValue('12345');
        await context.setSelectionRange(2, 4, 'backward');

        try {
          await assertInitialSelectionRange(input, 2, 4, 'forward');
          fail('did not throw');
        } catch (e) {
          expect(e.message).toMatch(/direction/);
        }
      });
    });
  });

  describe('assertInitialValue', () => {
    it('should throw if value does not match', async () => {
      const input = await demoForm.getControl('second input');
      await input.focus();
      await context.setValue('unexpected');

      try {
        await assertInitialValue(input, 'expected');
        fail('did not throw');
      } catch (e) {
        expect().nothing();
      }
    });

    it('should not throw if value is expected', async () => {
      const input = await demoForm.getControl('second input');
      await input.focus();
      await context.setValue('expected');

      try {
        await assertInitialValue(input, 'expected');
        expectNotToHaveThrownAnything();
      } catch (e) {
        fail('did throw: ' + e.message);
      }
    });
  });

  describe('expectSelectionRange', () => {
    it ('should not fail if selection range matches expected range and direction', async () => {
      const input = await demoForm.getControl('second input');
      await input.focus();
      await context.setValue('12345');
      await context.setCursor(3);

      await expectSelectionRange(input, 3, 3);
    });

    it ('should fail if selection range isn\'t expected selection range', async () => {
      const input = await demoForm.getControl('second input');
      await input.focus();
      await context.setValue('12345');
      await context.setSelectionRange(2, 4, 'backward');

      await expectSelectionRange(input, 2, 5);

      const result = getCurrentSpecResult();
      expect(result.failedExpectations?.pop()?.message).toMatch(/selection/);
    });

    describe('with given selection direction', () => {
      it ('should not fail if direction matches', async () => {
        const input = await demoForm.getControl('second input');
        await input.focus();
        await context.setValue('12345');
        await context.setSelectionRange(2, 4, 'forward');

        await expectSelectionRange(input, 2, 4, 'forward');
      });

      it ('should thow if direction does not match', async () => {
        const input = await demoForm.getControl('second input');
        await input.focus();
        await context.setValue('12345');
        await context.setSelectionRange(2, 4, 'backward');

        await expectSelectionRange(input, 2, 4, 'forward');

        const result = getCurrentSpecResult();
        expect(result.failedExpectations?.pop()?.message).toMatch(/direction/);
      });
    });
  });

  describe('describeDoNothingInInputThatPreventsDefaults', () => {
    describe('should fail if given action does not change anything without preventDefault', () => {
      let failedCount = 0;
      describeDoNothingInInputThatPreventsDefaults(context, () => demoForm, () => Promise.resolve());
      afterEach(() => {
        const spec = getCurrentSpecResult();
        const failedExpectations = spec.failedExpectations || [];
        failedCount += failedExpectations.length;

        if (spec.description === 'should do something') {
          const failed = failedExpectations.pop();
          expect(failed).toBeTruthy('should do something did not fail');
        }
      });
      afterAll(() => {
        expect(failedCount).toBeGreaterThan(0);
      });
    });

    describe('should fail if given action changes value of input with preventDefault', () => {
      let failedCount = 0;
      describeDoNothingInInputThatPreventsDefaults(context, () => demoForm, () => context.setValue('updated'));
      afterEach(() => {
        const spec = getCurrentSpecResult();
        const failedExpectations = spec.failedExpectations || [];
        failedCount += failedExpectations.length;

        if (spec.description.match(/should not .*change .*value/)) {
          const failed = failedExpectations.pop();
          while (failedExpectations.pop()) {}
          expect(failed).toBeTruthy(spec.description + ' should have failed');
        }
      });
      afterAll(() => {
        expect(failedCount).toBeGreaterThan(0);
      });
    });

    describe('should fail if given action changes selection of input with preventDefault', () => {
      let failedCount = 0;
      describeDoNothingInInputThatPreventsDefaults(context, () => demoForm, () => context.setCursor(1));
      afterEach(() => {
        const spec = getCurrentSpecResult();
        const failedExpectations = spec.failedExpectations || [];
        failedCount += failedExpectations.length;

        if (spec.description.match(/should not .*move .*cursor/)) {
          const failed = failedExpectations.pop();
          while (failedExpectations.pop()) {}
          expect(failed).toBeTruthy(spec.description + ' should have failed');
        }
      });
      afterAll(() => {
        expect(failedCount).toBeGreaterThan(0);
      });
    });
  });
});
