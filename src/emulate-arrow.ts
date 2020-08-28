import { emulateKeyEvents } from "./emulate-key-events";
import { findSelectionStart, TextInputElement, findSelectionEnd } from "./text-input-element.type";

const noEventThatCouldGetCanceled = true;

export interface ArrowKeys {
  up(): void;
  right(): void;
  down(): void;
  left(): void;
}

export interface EmulateArrow extends ArrowKeys {
  shift: ArrowKeys;
}

export const emulateArrow: EmulateArrow = {
  up: () => emulateArrowUp(),
  right: () => emulateArrowRight(),
  down: () => emulateArrowDown(),
  left: () => emulateArrowLeft(),
  shift: {
    up: () => emulateShiftArrowUp(),
    right: () => emulateShiftArrowRight(),
    down: () => emulateShiftArrowDown(),
    left: () => emulateShiftArrowLeft(),
  }
}

function emulateArrowUp() {
  return emulateKeyEvents('ArrowUp', (target) => {
    const lineLength = lineLengthOf(target);
    const selectionStart = findSelectionStart(target);

    setCursorOf(target, Math.max(selectionStart - lineLength, 0));
    return noEventThatCouldGetCanceled;
  });
}

function setCursorOf(target: TextInputElement, position: number) {
  target.setSelectionRange(position, position, 'none');
}

function lineLengthOf(target: TextInputElement, valueLength = valueLengthOf(target)) {
  return target instanceof HTMLTextAreaElement ? target.cols : valueLength;
}

function valueLengthOf(target: TextInputElement) {
  return target.value && target.value.length || 0;
}

function emulateArrowRight() {
  return emulateKeyEvents('ArrowRight', (target) => {
    if (target.selectionStart !== target.selectionEnd) {
      setCursorOf(target, findSelectionEnd(target));
      return noEventThatCouldGetCanceled;
    }
    
    const valueLength = valueLengthOf(target);
    const selectionEnd = findSelectionEnd(target);
    if (selectionEnd < valueLength) {
      setCursorOf(target, selectionEnd + 1);
    }
    return noEventThatCouldGetCanceled;
  });
}

function emulateArrowDown() {
  return emulateKeyEvents('ArrowDown', (target) => {
    const valueLength = valueLengthOf(target);
    const lineLength = lineLengthOf(target, valueLength);
    const selectionEnd = findSelectionEnd(target);
    setCursorOf(target, Math.min(selectionEnd + lineLength, valueLength));
    return noEventThatCouldGetCanceled;
  });
}

function emulateArrowLeft() {
  return emulateKeyEvents('ArrowLeft', (target) => {
    if (target.selectionStart !== target.selectionEnd) {
      setCursorOf(target, findSelectionStart(target));
      target.selectionEnd = target.selectionStart;
      return noEventThatCouldGetCanceled;
    }
    
    const selectionStart = findSelectionStart(target);
    if (selectionStart > 0) {
      setCursorOf(target, selectionStart - 1);
    }
    return noEventThatCouldGetCanceled;
  });
}

function emulateShiftArrowUp() {
  return emulateKeyEvents('ArrowUp', (target) => {
    const lineLength = lineLengthOf(target);
    
    if (isSelectionDirectionOf(target, 'forward')) {
      reduceSelectionAtSelectionEnd(target, lineLength);
    } else {
      extendSelectionAtSelectionStart(target, lineLength);
    }

    return noEventThatCouldGetCanceled;
  });
}

function isSelectionDirectionOf(target: TextInputElement, direction: 'forward' | 'backward') {
  return target.selectionDirection === direction && (target.selectionStart !== target.selectionEnd);
}

function extendSelectionAtSelectionStart(target: TextInputElement, lengthToExtend: number) {
  const selectionStart = findSelectionStart(target);
  const newSelectionStart = Math.max(selectionStart - lengthToExtend, 0);
  target.selectionStart = newSelectionStart;
  if (target.selectionDirection !== 'backward') {
    target.selectionDirection = 'backward';
  }
}

function reduceSelectionAtSelectionEnd(target: TextInputElement, lengthToReduce: number) {
  const selectionStart = findSelectionStart(target);
  const selectionEnd = findSelectionEnd(target);
  const newSelectionEnd = selectionEnd - lengthToReduce;

  if (selectionStart < newSelectionEnd) {
    target.selectionEnd = newSelectionEnd;
  } else {
    target.selectionEnd = selectionStart;
    target.selectionDirection = 'none';
  }
}

function emulateShiftArrowRight() {
  return emulateKeyEvents('ArrowRight', (target) => {
    if (isSelectionDirectionOf(target, 'backward')) {
      reduceSelectionAtSelectionStart(target, 1);
    } else {
      extendSelectionAtSelectionEnd(target, 1);
    }

    return noEventThatCouldGetCanceled;
  })
}

function extendSelectionAtSelectionEnd(target: TextInputElement, lengthToExtend: number) {
  const valueLength = valueLengthOf(target);
  const selectionEnd = findSelectionEnd(target, valueLength);
  target.selectionEnd = Math.min(selectionEnd + lengthToExtend, valueLength);
  if (target.selectionDirection !== 'forward') {
    target.selectionDirection = 'forward';
  }
}

function reduceSelectionAtSelectionStart(target: TextInputElement, lengthToReduce: number) {
  const selectionStart = findSelectionStart(target);
  const selectionEnd = findSelectionEnd(target);
  const newSelectionStart = selectionStart + lengthToReduce;

  if (newSelectionStart < selectionEnd) {
    target.selectionStart = newSelectionStart;
  } else {
    target.selectionStart = selectionEnd;
    target.selectionDirection = 'none';
  }
}

function emulateShiftArrowDown() {
  return emulateKeyEvents('ArrowDown', (target) => {
    const lineLength = lineLengthOf(target);

    if (isSelectionDirectionOf(target, 'backward')) {
      reduceSelectionAtSelectionStart(target, lineLength);
    } else {
      extendSelectionAtSelectionEnd(target, lineLength);
    }
    
    return noEventThatCouldGetCanceled;
  });
}

function emulateShiftArrowLeft() {
  return emulateKeyEvents('ArrowLeft', (target) => {
    if (isSelectionDirectionOf(target, 'forward')) {
      reduceSelectionAtSelectionEnd(target, 1);
    } else {
      extendSelectionAtSelectionStart(target, 1);
    }

    return noEventThatCouldGetCanceled;
  });
}