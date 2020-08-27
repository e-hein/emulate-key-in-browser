import { ComponentHarness } from "@angular/cdk/testing";
import { AnchorHarness } from "./anchor.harness";

export class DemoHarness extends ComponentHarness {
  static hostSelector = '.header';

  private iframe = this.documentRootLocatorFactory().locatorFor('iframe');

  async clickOnAngularExampleLink() {
    const link = await this.locatorFor(AnchorHarness.with({ target: /angular/ }))();
    await link.click();
  }

  async clickOnHtmlJsExampleLink() {
    const link = await this.locatorFor(AnchorHarness.with({ target: /plain\-html/ }))();
    await link.click();
  }

  async showsPrivacySettings() {
    const iframe = await this.iframe();
    const src = await iframe.getProperty('src');
    return typeof src === 'string' && src.includes('settings');
  }
}