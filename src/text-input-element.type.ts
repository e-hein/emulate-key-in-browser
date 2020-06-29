export type TextInputElement = HTMLInputElement | HTMLTextAreaElement;
export function isTextInputElement(element: Element): element is TextInputElement {
  return (element instanceof HTMLInputElement)
    || (element instanceof HTMLTextAreaElement)
  ;
}

export function getValueLength(target: TextInputElement) {
  return target.value && target.value.length || 0;
}

export function findSelectionStart(target: TextInputElement, valueLength = getValueLength(target)) {
  if (typeof target.selectionStart === 'number') return target.selectionStart;
  if (typeof target.selectionEnd === 'number') return target.selectionEnd;
  return valueLength;
}

export function findSelectionEnd(target: TextInputElement, valueLength = getValueLength(target)) {
  if (typeof target.selectionEnd === 'number') return target.selectionEnd;
  if (typeof target.selectionStart === 'number') return target.selectionStart;
  return valueLength;
}