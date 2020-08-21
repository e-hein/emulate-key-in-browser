import { TestElement } from '@angular/cdk/testing';
import { SharedSpecContext } from './shared-spec-context.model';
import { AppDemoFormHarness } from './app.harness';

async function checkSelectionRange(input: TestElement, start: number, end: number) {
  const selectionStart = await input.getProperty('selectionStart');
  const selectionEnd = await input.getProperty('selectionEnd');
  if ((selectionStart !== start) || (selectionEnd !== end)) {
    return `selection start: ${selectionStart} (${start}), selection end: ${selectionEnd} (${end})`;
  } else {
    return null;
  }
}

async function checkSelectionDirection(input: TestElement, direction: string | RegExp) {
  const selectionDirection = await input.getProperty('selectionDirection');
  const directionRegExp = typeof direction === 'string' ? new RegExp('^' + direction + '$') : direction;
  if (!directionRegExp.test(selectionDirection)) {
    return `selection direction: ${selectionDirection} (${direction})`;
  } else {
    return null;
  }
}

export async function assertInitialSelectionRange(input: TestElement, start: number, end: number, direction?: string) {
  const selectionRangeError = await checkSelectionRange(input, start, end);
  if (selectionRangeError) {
    throw new Error(`given test conditions invalid! (${selectionRangeError})`);
  }

  if (direction) {
    const selectionDirectionError = await checkSelectionDirection(input, direction);
    if (selectionDirectionError) {
      throw new Error(`given test conditions invalid! (${selectionDirectionError})`);
    }
  }
}

export async function assertInitialValue(input: TestElement, expectedValue: string) {
  const actualValue = await input.getProperty('value');
  if (actualValue !== expectedValue) {
    throw new Error(`given test conditions invalid! Expected value "${actualValue}" to be "${expectedValue}"`);
  }
}

export function expectNotToHaveThrownAnything() {
  expect().nothing();
}

export async function expectSelectionRange(input: TestElement, start: number, end: number, direction?: string | RegExp) {
  const selectionRangeError = await checkSelectionRange(input, start, end);
  if (selectionRangeError) {
    fail(selectionRangeError);
  } else {
    expect().nothing();
  }

  if (direction) {
    const selectionDirectionError = await checkSelectionDirection(input, direction);
    if (selectionDirectionError) {
      fail(selectionDirectionError);
    } else {
      expect().nothing();
    }
  }
}

export function describeDoNothingInInputThatPreventsDefaults(
  context: SharedSpecContext,
  getDemoForm: () => AppDemoFormHarness,
  testedAction: () => Promise<any>,
) {
  describe('in input', () => {
    describe('that prevents default', () => {
      it('that prevents default should not move cursor nor change selection or value', async () => {
        const inputThatPreventsDefault = await getDemoForm().getControl('prevent default');
        await inputThatPreventsDefault.focus();
        await context.setValue('12345');
        await context.setSelectionRange(2, 4, 'backward');

        await testedAction();

        expect(await inputThatPreventsDefault.getProperty('value')).toBe('12345', 'value');
        await expectSelectionRange(inputThatPreventsDefault, 2, 4, 'backward');
      });
    });

    describe('that does not prevent default', () => {
      it('should do something', async () => {
        const inputThatDoesNotPreventsDefault = await getDemoForm().getControl('first input');
        await inputThatDoesNotPreventsDefault.focus();
        await context.setValue('12345');
        await context.setSelectionRange(2, 4, 'backward');

        await testedAction();

        expect(false
          || (await inputThatDoesNotPreventsDefault.getProperty('value') !== '12345')
          || (await inputThatDoesNotPreventsDefault.getProperty('selectionStart') !== 2)
          || (await inputThatDoesNotPreventsDefault.getProperty('selectionEnd') !== 4)
          || (await inputThatDoesNotPreventsDefault.getProperty('selectionDirection') !== 'backward')
        ).toBe(true, 'did change nothing');
      });
    });
  });
}
