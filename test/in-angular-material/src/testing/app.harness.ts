import { ComponentHarness, TestElement, BaseHarnessFilters, HarnessPredicate } from '@angular/cdk/testing';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatFormFieldHarness } from '@angular/material/form-field/testing';

export type AppControlNames = 'shift'
  | 'tab' | 'shift tab' | 'backspace' | 'delete' | 'arrow up' | 'arrow left' | 'arrow right' | 'arrow down'
  | 'write "a"' | 'write "b"' | 'write "c"' | 'write "Leeroy"' | 'write "Jenkins"' | 'write lorem ipsum'
;
export const alternativeControls: { [key in AppControlNames]?: AppControlNames } = {
  tab: 'shift tab',
  backspace: 'delete',
};

interface ControlHarnessFilters extends BaseHarnessFilters {
  label?: string | RegExp;
  icon?: string | RegExp;
}

export class MatIconHarness extends ComponentHarness {
  public static hostSelector = '.material-icons';

  public async getText(): Promise<string> {
    return (await this.host()).text();
  }
}

class AppControlHarness extends ComponentHarness {
  public static hostSelector = '.mat-raised-button, .mat-mini-fab';
  public static with(options: ControlHarnessFilters): HarnessPredicate<AppControlHarness> {
    return new HarnessPredicate(AppControlHarness, options)
      .addOption(
        'label', options.label,
        async (harness, lookupLabel) => {
          const actualLabel = await harness.getLabel();
          const matches = await HarnessPredicate.stringMatches(actualLabel, lookupLabel);
//            console.log({ lookupLabel, actualLabel, matches });
          return matches;
        },
      )
      .addOption(
        'icon', options.icon,
        async (harness, lookupText) => {
          const icon = await harness.getIcon();
          const iconText = icon ? await icon.getText() : '';
          const matches = await HarnessPredicate.stringMatches(iconText, lookupText);
//          console.log({ lookupText: lookupText.toString(), iconText, matches });
          return matches;
        }
      )
    ;
  }

  public async getIcon(): Promise<MatIconHarness | undefined> {
    return this.locatorForOptional(MatIconHarness)();
  }

  public async getLabel(): Promise<string> {
    const icon = await this.getIcon();
    const iconText = icon ? await icon.getText() : '';
    return (await (await this.host()).text()).replace(iconText, '').trim();
  }
}

export class AppControlsHarness extends ComponentHarness {
  public static hostSelector = 'mat-sidenav';

  // tslint:disable object-literal-key-quotes
  private getter: { [key in AppControlNames]: () => Promise<TestElement> } = {
    'shift': () => this.getTextButtonWithLabel('shift'),
    'tab': () => this.getTextButtonWithLabel('tab'),
    'shift tab': () => this.getTextButtonWithLabel('shift tab'),
    'backspace': () => this.getTextButtonWithLabel('backspace'),
    'delete': () => this.getTextButtonWithLabel('delete'),
    'arrow up': () => this.getArrowButtonWithIcon(/up$/),
    'arrow left': () => this.getArrowButtonWithIcon(/left$/),
    'arrow right': () => this.getArrowButtonWithIcon(/right$/),
    'arrow down': () => this.getArrowButtonWithIcon(/down$/),
    'write "a"': () => this.getTextButtonWithLabel(/"a"/i),
    'write "b"': () => this.getTextButtonWithLabel(/"b"/i),
    'write "c"': () => this.getTextButtonWithLabel(/"c"/i),
    'write "Leeroy"': () => this.getTextButtonWithLabel('"Leeroy"'),
    'write "Jenkins"': () => this.getTextButtonWithLabel('"Jenkins"'),
    'write lorem ipsum': () => this.getTextButtonWithLabel('Lorem ipsum'),
  };
  // tslint:enable object-literal-key-quotes

  private otherElement = this.documentRootLocatorFactory().locatorFor('h1');

  private async getTextButtonWithLabel(label: string | RegExp) {
    return (await this.locatorFor(AppControlHarness.with({ label }))()).host();
  }

  private async getArrowButtonWithIcon(icon: string | RegExp) {
    return (await this.locatorFor(AppControlHarness.with({ icon }))()).host();
  }

  public async isShiftActive(): Promise<boolean> {
    return (await this.host()).hasClass('shift');
  }

  public async getAll(): Promise<{ [key in AppControlNames ]?: TestElement }> {
    const controlsToSkip = await this.isShiftActive() ? Object.keys(alternativeControls) : Object.values(alternativeControls);
    return Object.entries(this.getter)
    .filter(([key]) => !controlsToSkip.includes(key))
    .reduce((others, [key, getter]) => others.then(
      (controls) => getter().then(
        (control) => Object.assign(controls, { [key]: control }),
      )
    ), Promise.resolve({} as { [key in AppControlNames ]: TestElement }));
  }

  public async get(controlName: AppControlNames) {
    return await this.getter[controlName]();
  }

  public isShown(controlName: AppControlNames) {
    return this.get(controlName).then(() => true, () => false);
  }

  async hoverOver(controlName: AppControlNames) {
    const otherElement = await this.otherElement();
    await otherElement.hover();
    await (await this.get(controlName)).hover();
    await otherElement.hover();
  }
}

export type AppDemoFormInputNames = 'first input' | 'second input' | 'textarea' | 'disabled input' | 'button';

export class AppDemoFormHarness extends ComponentHarness {
  public static hostSelector = '.demo-form-controls';

  private button = this.locatorFor(MatButtonHarness);

  public async getControl(name: AppDemoFormInputNames) {
    return name === 'button' ? this.getButton() : this.getInput(name);
  }

  private async getButton() {
    return (await this.button()).host();
  }

  private async getInput(name: AppDemoFormInputNames) {
    return this.elementFromFormField(await this.locatorFor(MatFormFieldHarness.with({floatingLabelText: name}))());
  }

  private async elementFromFormField(formField: MatFormFieldHarness) {
    const control = (await formField.getControl());
    return control.host();
  }
}

export class AppHarness extends ComponentHarness {
  public static hostSelector = 'app-root';

  private form = this.locatorFor(AppDemoFormHarness);

  public getControls(): Promise<AppControlsHarness> {
    return this.locatorFor(AppControlsHarness)();
  }

  public getDemoFrom() {
    return this.form();
  }
}
