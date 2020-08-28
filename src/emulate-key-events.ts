import { TextInputElement, isTextInputElement } from "./text-input-element.type";

export function findKeyTarget(): Element {
  return document.activeElement || document.body;
}

export function emulateKeyEvents(key: string, textInputAction?: (target: TextInputElement) => boolean, target = findKeyTarget(), options?: {
  keypressBubbles?: boolean
}) {
  let executeDefaultActions = target.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true }));
  executeDefaultActions = target.dispatchEvent(new KeyboardEvent('keypress', { key, cancelable: true, bubbles: options?.keypressBubbles })) && executeDefaultActions;
  if (executeDefaultActions && textInputAction && isTextInputElement(target)) {
    executeDefaultActions = textInputAction(target);
  }
  executeDefaultActions = target.dispatchEvent(new KeyboardEvent('keyup', { key, cancelable: true })) && executeDefaultActions;
}
