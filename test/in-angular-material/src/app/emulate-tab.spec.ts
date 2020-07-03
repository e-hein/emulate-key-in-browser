import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { AppHarness, testEmulateTab } from '@app/testing';
import { emulateKey } from 'emulate-key-in-browser';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('emulate tab', () => {
  let app: AppHarness;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    app = await TestbedHarnessEnvironment.harnessForFixture(fixture, AppHarness);
  });

  testEmulateTab(() => app, emulateKey);
});
