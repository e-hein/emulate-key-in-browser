import { emulateKey } from 'emulate-key-in-browser';
import { ComponentFixture } from '@angular/core/testing';
import { AsyncEmulateKey } from '@app/testing';
import { forceStabilize } from './force-stabilze';

// tslint:disable: member-ordering
export class WrappedEmulateKeyWithFixture implements AsyncEmulateKey {
  constructor(
    public fixture?: ComponentFixture<any>,
  ) {}

  private forceStabilize<T>(after: () => T) {
    return forceStabilize(this.fixture, after);
  }

  readonly tab = {
    forwards: () => this.forceStabilize(emulateKey.tab.forwards),
    backwards: () => this.forceStabilize(emulateKey.tab.backwards),
    findSelectableElements: () => Promise.resolve(emulateKey.tab.findSelectableElements()),
  };

  readonly arrow = {
    up: () => this.forceStabilize(emulateKey.arrow.up),
    right: () => this.forceStabilize(emulateKey.arrow.right),
    down: () => this.forceStabilize(emulateKey.arrow.down),
    left: () => this.forceStabilize(emulateKey.arrow.left),
  };

  readonly shiftArrow = {
    up: () => this.forceStabilize(emulateKey.shiftArrow.up),
    right: () => this.forceStabilize(emulateKey.shiftArrow.right),
    down: () => this.forceStabilize(emulateKey.shiftArrow.down),
    left: () => this.forceStabilize(emulateKey.shiftArrow.left),
  };

  readonly shiftTab = () => this.forceStabilize(emulateKey.shiftTab);
  readonly backspace = () => this.forceStabilize(emulateKey.backspace);
  readonly delete = () => this.forceStabilize(emulateKey.delete);
  readonly writeText = (keys: string) => this.forceStabilize(() => emulateKey.writeText(keys));
}
