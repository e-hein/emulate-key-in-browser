import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture } from '@angular/core/testing';
import { AppHarness, AsyncEmulateKey, SharedSpecContext } from '@app/testing';
import { AppComponent } from 'src/app/app.component';
import { forceStabilize } from './force-stabilze';
import { WrappedEmulateKeyWithFixture } from './wrapped-emulate-key-with-fixture';

function setSelectionRange(start: number, end: number, direction: 'forward' | 'backward' | 'none') {
  const input = document.activeElement as HTMLInputElement;
  input.selectionStart = start;
  input.selectionEnd = end;
  input.selectionDirection = direction;
}

function setValue(value: string | null) {
  const input = document.activeElement as HTMLInputElement;
  input.value = value;
}

export class SharedSpecContextWithFixture implements SharedSpecContext {
  emulateKey: AsyncEmulateKey;
  app: AppHarness;
  setSelectionRange: (start: number, end: number, direction: 'forward' | 'backward' | 'none') => Promise<void>;
  setCursor: (position: number) => Promise<void>;
  setValue: (value: string) => Promise<void>;

  async updateFixture(fixture: ComponentFixture<AppComponent>) {
    this.app = await TestbedHarnessEnvironment.harnessForFixture(fixture, AppHarness);
    this.emulateKey = new WrappedEmulateKeyWithFixture(fixture);
    this.setSelectionRange = (start, end, direction) => forceStabilize(fixture, () => setSelectionRange(start, end, direction));
    this.setCursor = (pos) => this.setSelectionRange(pos, pos, 'none');
    this.setValue = (value) => forceStabilize(fixture, () => setValue(value));
  }
}
