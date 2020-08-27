import { ComponentHarness, BaseHarnessFilters, HarnessPredicate } from "@angular/cdk/testing";
import { AnchorHarness, AnchorHarnessFilters } from "./anchor.harness";

export class ReadmeBadgeHarness extends AnchorHarness {
  static hostSelector = 'a[target=_blank]';
  static with(filters: AnchorHarnessFilters) {
    return new HarnessPredicate(ReadmeBadgeHarness, filters)
      .add('anchor', (badge) => AnchorHarness.with(filters).evaluate(badge))
    ;
  }

  private img = this.locatorFor('img');

  getImage() {
    return this.img();
  }

  showsImage() {
    return this.getImage().then(() => true, () => false);
  }
}

export class ReadmeHarness extends ComponentHarness {
  static hostSelector = 'div#content';

  async getNpmShield() {
    return await this.locatorFor(ReadmeBadgeHarness.with({target: /npmjs\.com/}))();
  }
}