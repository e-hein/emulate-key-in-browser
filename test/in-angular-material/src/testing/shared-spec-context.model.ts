import type { emulateKey as emulateKeyType } from 'emulate-key-in-browser';
import { AppHarness } from './app.harness';
export interface AsyncEmulateKey {
  tab: {
    backwards: () => Promise<boolean>;
    forwards: () => Promise<boolean>;
    findSelectableElements: () => Promise<{ id?: string, tagName: string, className?: string }[]>;
  };
  shiftTab: () => Promise<boolean>;

  arrow: {
    [key in keyof typeof emulateKeyType.arrow]: () => Promise<void>;
  };
  shiftArrow: {
    [key in keyof typeof emulateKeyType.shiftArrow]: () => Promise<void>;
  };

  backspace: () => Promise<void>;
  delete: () => Promise<void>;
}

export interface SharedSpecContext {
  app: AppHarness;
  emulateKey: AsyncEmulateKey;
}
