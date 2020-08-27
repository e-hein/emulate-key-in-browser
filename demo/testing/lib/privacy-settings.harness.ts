import { BaseHarnessFilters, ComponentHarness, HarnessPredicate } from "@angular/cdk/testing";

export interface PrivacyButtonFilters extends BaseHarnessFilters {
  label?: string | RegExp;
}

export class PrivacySettingsButtonHarness extends ComponentHarness {
  static hostSelector = 'button';
  static with(filters: PrivacyButtonFilters) {
    return new HarnessPredicate(PrivacySettingsButtonHarness, filters)
      .addOption('label', filters.label, async (button, lookedLabel) => {
        const actualLabel = await button.getLabel();
        const matches =  HarnessPredicate.stringMatches(actualLabel, lookedLabel);
        return matches;
      })
    ;
  }

  async getLabel() {
    return await (await this.host()).text();
  }

  async click() {
    await (await this.host()).click();
  }
}

export class PrivacySettingsButtonBarHarness extends ComponentHarness {
  static hostSelector = '.button-bar';

  async getAcceptAllButton() {
    return await this.locatorFor(PrivacySettingsButtonHarness.with({ label: 'accept all' }))();
  }
}

export class PrivacySettingsHarness extends ComponentHarness {
  static hostSelector = 'form';

  private buttonBar = this.locatorFor(PrivacySettingsButtonBarHarness);

  async acceptAll() {
    const buttonBar = await this.buttonBar();
    const accceptButton = await buttonBar.getAcceptAllButton();
    await accceptButton.click();
  }
}