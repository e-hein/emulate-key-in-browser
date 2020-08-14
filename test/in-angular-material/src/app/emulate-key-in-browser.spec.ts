import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { AppHarness, AsyncEmulateKey, testEmulateArrows, testEmulateTab } from '@app/testing';
import { emulateKey } from 'emulate-key-in-browser';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('emulate key in browser', () => {
  const context = {
    app: undefined as AppHarness,
    emulateKey: undefined as AsyncEmulateKey,
  };

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
        right: () => forceStabilize(emulateKey.shiftArrow.up),
        down: () => forceStabilize(emulateKey.shiftArrow.up),
        left: () => forceStabilize(emulateKey.shiftArrow.up),
      }
    };
  });

  describe('emulate tab', () => testEmulateTab(context));
  fdescribe('emulate arrows', () => testEmulateArrows(context));
});
