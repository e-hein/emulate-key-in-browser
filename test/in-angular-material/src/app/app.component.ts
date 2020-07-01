import { Component } from '@angular/core';
import { emulateKey } from 'emulate-key-in-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public isShiftActive = false;
  public loremIpsum = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.';

  public emulateShift() {
    this.isShiftActive = !this.isShiftActive;
  }

  public emulateTab() {
    return emulateKey.tab.forwards();
  }

  public emulateShiftTab() {
    return emulateKey.tab.backwards();
  }

  public emulateBackspace() {
    return emulateKey.backspace();
  }

  public emulateDelete() {
    return emulateKey.delete();
  }

  public emulateArrowUp() {
    return this.isShiftActive ? emulateKey.shiftArrow.up() : emulateKey.arrow.up();
  }

  public emulateArrowLeft() {
    return this.isShiftActive ? emulateKey.shiftArrow.left() : emulateKey.arrow.left();
  }
  public emulateArrowRight() {
    return this.isShiftActive ? emulateKey.shiftArrow.right() : emulateKey.arrow.right();
  }
  public emulateArrowDown() {
    return this.isShiftActive ? emulateKey.shiftArrow.down() : emulateKey.arrow.down();
  }
  public emulateWriteText(text: string) {
    const textToWrite = this.isShiftActive
      ? text.charAt(0).toUpperCase() + text.slice(1)
      : text
    ;
    return emulateKey.writeText(textToWrite);
  }
}
