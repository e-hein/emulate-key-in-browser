import { emulateTab } from 'emulate-tab';
import { emulateArrow, ArrowKeys } from './emulate-arrow';
import { emulateBackspace, emulateDelete } from './emulate-backspace';
import { emulateMouse } from './emulate-mouse';
import { emulateWriteText } from './emulate-write-text';

export const emulateKey = {
  tab: emulateTab,
  shiftTab: emulateTab.backwards,
  backspace: emulateBackspace,
  delete: emulateDelete,
  mouse: emulateMouse,
  arrow: emulateArrow as ArrowKeys,
  shiftArrow: emulateArrow.shift,
  writeText: emulateWriteText,
};
