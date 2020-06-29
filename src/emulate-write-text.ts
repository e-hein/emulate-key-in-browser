import { emulateKeyEvents } from "./emulate-key-events";
import { findSelectionStart, findSelectionEnd } from "./text-input-element.type";

export function emulateWriteText(keys: string) {
  const keyArray = keys.split('');
  const firstKey = keyArray.shift();
  if (!firstKey) return;

  emulateKeyEvents(firstKey, (target) => {
    const value = target.value || '';
    const valueLength = value.length;
    const selectionStart = findSelectionStart(target, valueLength);
    if (selectionStart !== valueLength) {
      const selectionEnd = findSelectionEnd(target, valueLength);
      target.value = value.substr(0, selectionStart) + firstKey + value.substr(selectionEnd);
      target.selectionStart = target.selectionEnd = selectionStart + 1;
      target.selectionDirection = 'none';
    } else {
      target.value += firstKey;
    }
    return target.dispatchEvent(new InputEvent('input'));
  });

  keyArray.forEach((key) => emulateKeyEvents(key, (target) => {
    target.value += key;
    return target.dispatchEvent(new InputEvent('input'));
  }));
};