import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import {
  AppHarness,
  SharedSpecContext, testEmulateArrowAfterSelection, testEmulateArrows,
  testEmulateBackspace, testEmulateDelete, testEmulateShiftArrows, testEmulateTab,
  testEmulateWritingText,
  testSharedSpecContext,
} from '@app/testing';
import { emulateKey } from 'emulate-key-in-browser';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

function setSelectionRange(start: number, end = start, direction: 'forward' | 'backward' | 'none') {
  const input = document.activeElement as HTMLInputElement;
  input.selectionStart = start;
  input.selectionEnd = end;
  input.selectionDirection = direction;
}

function setValue(value: string | null) {
  const input = document.activeElement as HTMLInputElement;
  input.value = value;
}

describe('emulate key in browser', () => {
  const context = {} as SharedSpecContext;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    function forceStabilize(after = () => {}) {
      after();
      fixture.detectChanges();
      return fixture.whenStable();
    }
    context.app = await TestbedHarnessEnvironment.harnessForFixture(fixture, AppHarness);
    context.setSelectionRange = (start, end, direction) => forceStabilize(() => setSelectionRange(start, end, direction));
    context.setCursor = (pos) => context.setSelectionRange(pos, pos, 'none');
    context.setValue = (value) => forceStabilize(() => setValue(value));

    context.emulateKey = {
      tab: {
        forwards: () => forceStabilize(emulateKey.tab.forwards),
        backwards: () => forceStabilize(emulateKey.tab.backwards),
        findSelectableElements: () => Promise.resolve(emulateKey.tab.findSelectableElements()),
      },
      shiftTab: () => forceStabilize(emulateKey.shiftTab),

      arrow: {
        up: () => forceStabilize(emulateKey.arrow.up),
        right: () => forceStabilize(emulateKey.arrow.right),
        down: () => forceStabilize(emulateKey.arrow.down),
        left: () => forceStabilize(emulateKey.arrow.left),
      },
      shiftArrow: {
        up: () => forceStabilize(emulateKey.shiftArrow.up),
        right: () => forceStabilize(emulateKey.shiftArrow.right),
        down: () => forceStabilize(emulateKey.shiftArrow.down),
        left: () => forceStabilize(emulateKey.shiftArrow.left),
      },

      backspace: () => forceStabilize(emulateKey.backspace),
      delete: () => forceStabilize(emulateKey.delete),

      writeText: (keys: string) => forceStabilize(() => emulateKey.writeText(keys)),
    };
  });

  describe('shared spec context', () => testSharedSpecContext(context));
  describe('tab', () => testEmulateTab(context));
  describe('arrows', () => testEmulateArrows(context));
  describe('shift arrow', () => testEmulateShiftArrows(context));
  describe('arrow after selection', () => testEmulateArrowAfterSelection(context));
  describe('backspace', () => testEmulateBackspace(context));
  describe('delete', () => testEmulateDelete(context));
  describe('writing text', () => testEmulateWritingText(context));
});
