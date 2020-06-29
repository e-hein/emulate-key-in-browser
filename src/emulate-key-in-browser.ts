import { emulateTab } from 'emulate-tab';

export namespace emulateKey {
  export const tab = emulateTab;
  export const shiftTab = emulateTab.backwards;
}
