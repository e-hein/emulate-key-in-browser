import { emulateKeyEvents } from "./emulate-key-events";
import { findSelectionStart, findSelectionEnd } from "./text-input-element.type";

export function emulateWriteText(keys: string) {
  keys.split('').forEach(writeKey);
};

function writeKey(key: string) {
  return emulateKeyEvents(key, (target) => {
    const value = target.value || '';
    const valueLength = value.length;
    const selectionStart = findSelectionStart(target, valueLength);
    if (selectionStart !== valueLength) {
      const selectionEnd = findSelectionEnd(target, valueLength);
      target.value = value.substr(0, selectionStart) + key + value.substr(selectionEnd);
      target.selectionStart = target.selectionEnd = selectionStart + 1;
      target.selectionDirection = 'none';
    } else {
      target.value += key;
    }
    return target.dispatchEvent(new InputEvent('input', { bubbles: true, }));
  }, undefined, { keypressBubbles: true });
}