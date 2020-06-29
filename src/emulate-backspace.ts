import { emulateKeyEvents } from "./emulate-key-events";
import { findSelectionEnd, findSelectionStart } from "./text-input-element.type";

export function emulateBackspace() {
  return emulateKeyEvents('Backspace', (target) => {
    const value = target.value || '';
    const valueLength = value.length;
    if (valueLength > 0) {
      const selectionStart = findSelectionStart(target, valueLength);
      const selectionEnd = findSelectionEnd(target, valueLength);
      if (selectionStart !== selectionEnd) {
        target.value = value.substr(0, selectionStart) + value.substr(selectionEnd);
        target.setSelectionRange(selectionStart, selectionStart, 'none');
      } else if (selectionStart > 0) {
        const newSelectionStart = selectionStart - 1;
        target.value = value.substr(0, newSelectionStart) + value.substr(selectionEnd);
        target.setSelectionRange(newSelectionStart, newSelectionStart, 'none');
      }
    }
    return target.dispatchEvent(new InputEvent('input'));
  });
}

export function emulateDelete() {
  return emulateKeyEvents('Delete', (target) => {
    const value = target.value || '';
    const valueLength = value.length;
    if (valueLength > 0) {
      const selectionStart = findSelectionStart(target, valueLength);
      const selectionEnd = findSelectionEnd(target, valueLength);
      if (selectionStart !== selectionEnd) {
        target.value = value.substr(0, selectionStart) + value.substr(selectionEnd);
        target.setSelectionRange(selectionStart, selectionStart, 'none');
      } else if (selectionEnd < valueLength) {
        target.value = value.substr(0, selectionEnd) + value.substr(selectionEnd + 1);
        target.setSelectionRange(selectionEnd, selectionEnd, 'none');
      }
    }
    return target.dispatchEvent(new InputEvent('input'));
  });
}
