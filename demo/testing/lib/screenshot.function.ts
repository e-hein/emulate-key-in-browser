import { browser } from "protractor";

export function checkScreen(ident: string): Promise<number> {
  return browser.imageComparison.checkScreen(ident, { /* some options*/ });
}