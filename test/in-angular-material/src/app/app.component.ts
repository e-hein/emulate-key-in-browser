import { Component } from '@angular/core';
import { emulateKey } from 'emulate-key-in-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  public emulateTab() {
    console.log('emulate tab');
    return emulateKey.tab.forwards();
  }

  public emulateShiftTab() {
    console.log('emulate shift tab');
    return emulateKey.tab.backwards();
  }

  public divClicked() {
    console.log('clicked');
  }
}
