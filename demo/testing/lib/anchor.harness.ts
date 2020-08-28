import { ComponentHarness, BaseHarnessFilters, HarnessPredicate } from "@angular/cdk/testing";

export interface AnchorHarnessFilters extends BaseHarnessFilters {
  target?: string | RegExp;
}

export class AnchorHarness extends ComponentHarness {
  static hostSelector = 'a';
  static with(filters: AnchorHarnessFilters) {
    return new HarnessPredicate(AnchorHarness, filters)
      .addOption('target', filters.target, (anchor, target) => HarnessPredicate.stringMatches(anchor.getTarget(), target))
    ;
  }

  async getTarget(): Promise<string> {
    return (await this.host()).getProperty('href');
  }

  async click(): Promise<void> {
    await (await this.host()).click();
  }
}