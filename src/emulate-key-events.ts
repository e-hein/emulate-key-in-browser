import { TextInputElement, isTextInputElement } from "./text-input-element.type";

export function findKeyTarget(): Element {
  return document.activeElement || document.body;
}

export function emulateKeyEvents(key: string, textInputAction?: (target: TextInputElement) => boolean, target = findKeyTarget()) {
  return true
    && target.dispatchEvent(new KeyboardEvent('keydown', { key }))
    && target.dispatchEvent(new KeyboardEvent('keypress', { key }))
    && (!isTextInputElement(target) || !textInputAction || textInputAction(target))
    && target.dispatchEvent(new KeyboardEvent('keyup', { key }))
  ;
}
