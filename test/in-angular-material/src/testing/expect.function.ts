import { TestElement } from '@angular/cdk/testing';

export function expectNotToHaveThrownAnything() {
  expect().nothing();
}

export async function assertInitialSelectionRange(input: TestElement, start: number, end: number, direction?: string) {
  const selectionStart = await input.getProperty('selectionStart');
  const selectionEnd = await input.getProperty('selectionEnd');
  if ((selectionStart !== start) || (selectionEnd !== end)) {
    throw new Error(`given test conditions invalid! (selection start: ${selectionStart} (${start}), selection end: ${selectionEnd} (${end}))`);
  }

  if (direction) {
    const selectionDirection = await input.getProperty('selectionDirection');
    if (direction !== selectionDirection) {
      throw new Error(`given test conditions invalid! (selection direction: ${selectionDirection} (${direction})`);
    }
  }
}

export async function assertInitialValue(input: TestElement, expectedValue: string) {
  const actualValue = await input.getProperty('value');
  if (actualValue !== expectedValue) {
    throw new Error(`given test conditions invalid! Expected value "${actualValue}" to be "${expectedValue}"`);
  }
}
