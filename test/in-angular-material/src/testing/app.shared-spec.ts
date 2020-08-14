import { AppHarness, AppControlsHarness, AppDemoFormHarness, AppDemoFormInputNames, AppControlNames } from './app.harness';
import { expectNotToHaveThrownAnything } from './expect.function';
import { HarnessLoader } from '@angular/cdk/testing';

export function testApp(loaderProvider: () => HarnessLoader, getActiveElementId: () => Promise<string>) {
  let app: AppHarness;
  let controls: AppControlsHarness;
  let demoForm: AppDemoFormHarness;

  beforeEach(async () => {
    app = await loaderProvider().getHarness(AppHarness);
    controls = await app.getControls();
    demoForm = await app.getDemoFrom();
  });

  it('should start', () => expect(app).toBeTruthy());

  describe('initially', () => {
    it('should find all controls', async () => {
      await controls.getAll();
      expectNotToHaveThrownAnything();
    });

    it('should initially have no active element', async () => expect(await getActiveElementId()).toBe(''));

    itShouldShow('tab');
    itShouldNotShow('shift tab');
    itShouldShow('backspace');
    itShouldNotShow('delete');
  });

  describe('interaction', () => {
    describeAfterHover('shift', () => {
      it('should find alternative controls', async () => {
        const controlsFound = await controls.getAll();

        // tslint:disable: no-string-literal
        expect(controlsFound['tab']).toBeFalsy('tab');
        expect(controlsFound['shift tab']).toBeTruthy('shift tab');
        expect(controlsFound['backspace']).toBeFalsy('backspace');
        expect(controlsFound['delete']).toBeTruthy('delete');
        // tslint:enable: no-string-literal
      });
    });


    describeClickInto('first input', () => {
      describeAndHover('tab', () => itShouldHaveFocused('second input'));
      describeAndHover(['shift', 'shift tab'], () => itShouldHaveFocused('button'));
      describeAndHover('write "a"', () => itShouldHaveSetValueOf('first input').to('a'));
      describeAndHover('write "b"', () => itShouldHaveSetValueOf('first input').to('b'));
      describeAndHover('write "c"', () => itShouldHaveSetValueOf('first input').to('c'));

      describeAndHover('write "Leeroy"', () => {
        itShouldHaveSetValueOf('first input').to('Leeroy');

        describeAndHover('backspace', () => {
          itShouldHaveSetValueOf('first input').to('Leero');
        });

        describeAndHover(['arrow left', 'write "a"'], () => itShouldHaveSetValueOf('first input').to('Leeroay'));
        describeAndHover(['arrow left', 'arrow right', 'write "a"'], () => itShouldHaveSetValueOf('first input').to('Leeroya'));
        describeAndHover(['arrow left', 'shift', 'arrow right', 'write "b"'], () => itShouldHaveSetValueOf('first input').to('LeeroB'));
        describeAndHover(
          ['arrow left', 'arrow left', 'arrow left', 'shift', 'arrow down', 'delete'],
          () => itShouldHaveSetValueOf('first input').to('Lee'),
        );
        describeAndHover(
          ['arrow left', 'arrow left', 'arrow down', 'write "a"'],
          () => itShouldHaveSetValueOf('first input').to('Leeroya'),
        );
        describeAndHover(['arrow up', 'write "a"'], () => itShouldHaveSetValueOf('first input').to('aLeeroy'));

        describeAndHover(['shift', 'arrow left', 'write "c"'], () => itShouldHaveSetValueOf('first input').to('LeeroC'));
        describeAndHover(['shift', 'arrow up', 'write "b"'], () => itShouldHaveSetValueOf('first input').to('B'));
      });

      describeAndHover('write "Jenkins"', () => {
        itShouldHaveSetValueOf('first input').to('Jenkins');
      });

      describeAndHover('write "Jenkins"', () => {
        itShouldHaveSetValueOf('first input').to('Jenkins');
      });

      describeAndHover('write lorem ipsum', () => {
        itShouldHaveSetValueOf('first input').to(/^Lorem ipsum.{100,}/);
      });
    });
  });

  function describeAfterHover(controlName: AppControlNames | AppControlNames[], specDefinitions: () => void) {
    describeHover('after', controlName, specDefinitions);
  }

  function describeHover(conjuction: string, controlName: AppControlNames | AppControlNames[], specDefinitions: () => void) {
    const controlsToHover = typeof controlName === 'string' ? [controlName] : controlName;
    describe(`${conjuction} hover "${controlsToHover.join('", "')}" button`, () => {
      beforeEach(() => controlsToHover.reduce((last, next) => last.then(() => controls.hoverOver(next)), Promise.resolve()));
      specDefinitions();
    });
  }

  function describeClickInto(controlName: AppDemoFormInputNames, specDefinitions: () => void) {
    describe(`click into "${controlName}"`, () => {
      beforeEach(async () => await (await demoForm.getControl(controlName)).click());
      specDefinitions();
    });
  }

  function describeAndHover(controlName: AppControlNames | AppControlNames[], specDefinitions: () => void) {
    describeHover('and', controlName, specDefinitions);
  }

  function itShouldShow(controlName: AppControlNames) {
    it (`should show control "${controlName}"`, async () => expect(await controls.isShown(controlName)).toBe(true));
  }

  function itShouldNotShow(controlName: AppControlNames) {
    it (`should *not* show control "${controlName}"`, async () => expect(await controls.isShown(controlName)).toBe(false));
  }

  function itShouldHaveFocused(controlName: AppDemoFormInputNames) {
    it (`should have focused "${controlName}"`, async () => {
      const isFocused = await (await demoForm.getControl(controlName)).isFocused();
      expect(isFocused).toBe(true);
    });
  }

  function itShouldHaveSetValueOf(controlName: AppDemoFormInputNames) {
    return {
      to: (expectedValue: string | RegExp) => {
        it(`should have set value of "${controlName}" to "${expectedValue}"`, async () => {
          const control = await demoForm.getControl(controlName);
          const actualValue = await control.getProperty('value');
          if (typeof expectedValue === 'string') {
            expect(actualValue).toBe(expectedValue);
          } else {
            expect(actualValue).toMatch(expectedValue);
          }
        });
      }
    };
  }
}
