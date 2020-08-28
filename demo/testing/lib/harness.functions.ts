import { ComponentHarness, TestElement } from "@angular/cdk/testing";
import { WebElement } from "protractor";

export function webElementFromHarness(harness: ComponentHarness) {
  console.log(Object.keys(harness));
}

export function webElementFromTestElement(testElement: TestElement) {
  return (testElement as any).element as WebElement;
}