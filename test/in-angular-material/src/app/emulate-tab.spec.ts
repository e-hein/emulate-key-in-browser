import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expectNotToHaveThrownAnything } from '@app/testing';
import { emulateKey } from 'emulate-key-in-browser';
import { AppComponent } from './app.component';

describe('emulate tab', () => {
  let loader: HarnessLoader;
  let rootElement: HTMLElement;

  function findAllSelectableIdents() {
    const selectableElements = emulateKey.tab.findSelectableElements();
    const selectableElementIdents = selectableElements.map((e) => (e.id && '#' + e.id) || e.title || e.className);
    // console.log('selectableElements', selectableElementIdents);
    return selectableElementIdents;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
      declarations: [AppComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    loader = TestbedHarnessEnvironment.loader(fixture);
    rootElement = fixture.debugElement.nativeElement;
  });

  it('should start', () => expectNotToHaveThrownAnything());

  it('should find selectable inputs', () => {
    const selectableElementIds = findAllSelectableIdents();
    expect(selectableElementIds).toEqual([
      '#first-input',
      '#second-input',

      'jasmine-title',

      '#textarea',
      '#button',
    ]);
  });

  it('backwards', async () => {
    // given
    const firstInput = await (await loader.getHarness(MatInputHarness.with({ selector: '#first-input' }))).host();
    const secondInput = await (await loader.getHarness(MatInputHarness.with({ selector: '#second-input' }))).host();
    await secondInput.focus();

    // when
    await emulateKey.tab.backwards();

    // then
    expect(await firstInput.isFocused()).toBe(true);
  });

  it('forwards', async () => {
    // given
    const firstInput = await (await loader.getHarness(MatInputHarness.with({ selector: '#first-input' }))).host();
    const secondInput = await (await loader.getHarness(MatInputHarness.with({ selector: '#second-input' }))).host();
    await firstInput.focus();

    // when
    await emulateKey.tab.forwards();

    // then
    expect(await secondInput.isFocused()).toBe(true);
  });

  it('tab into input with value should select everything', async () => {
    // given
    const firstInput = await (await loader.getHarness(MatInputHarness.with({ selector: '#first-input' })));
    const secondInput = await (await loader.getHarness(MatInputHarness.with({ selector: '#second-input' })));
    await secondInput.setValue('something');
    await firstInput.focus();

    // when
    await emulateKey.tab();

    // then
    const activeElement = document.activeElement as HTMLInputElement;
    if (!(activeElement.id === 'second-input' && activeElement instanceof HTMLInputElement)) {
      throw new Error('expected an HTMLInputElement with the id "second-input" to be focused');
    }
    expect(activeElement.selectionStart).toBe(0, 'selection start');
    expect(activeElement.selectionEnd).toBeGreaterThan(0, 'selection end');
  });
});
