[![npm (tag)](https://img.shields.io/npm/v/emulate-key-in-browser/latest)](https://www.npmjs.com/package/emulate-key-in-browser)
[![Travis (.org)](https://img.shields.io/travis/e-hein/emulate-key-in-browser?label=travis)](https://travis-ci.org/e-hein/emulate-key-in-browser)

emulate key in browser
======================
Tries to emulate browser reaction for special keys like tab, arrows or backspace.

This helps testing behavior of components in unit tests (e.g. with jasmine or jest) without the need to launch a test enviroment and real browser (e.g. webdriver). Be aware that this sould not replace your real browser tests, but it will simplify early behavior tests.

Interactive demo: https://emulate-key-in-browser.net-root.de

Installation
------------
```npm i emulate-key-in-browser```  
or download unpackaged javascript files from our [releases](https://github.com/e-hein/emulate-key-in-browser/releases)

Usage
-----
#### typescript
```ts
import { emulateKey } from 'emulate-key-in-browser';

emulateKey.tab();
emulateKey.shiftTab();
emulateKey.backspace();
emaulteKey.delete();
emulateKey.arrow.up();
emulateKey.arrow.right();
emulateKey.arrow.down();
emulateKey.arrow.left();
emulateKey.shiftArrow.up();
emulateKey.shiftArrow.right();
emulateKey.shiftArrow.down();
emulateKey.shiftArrow.left();
emulateKey.writeText('content');
```
[-> complete angular material example project](test/in-angular-material/src/app/app.component.ts)

#### javascript
```html
<script src="emulate-key-in-browser.min.js">
<script>
  emulateKey.tab();
  emulateKey.arrow.up();
  emulateKey.shiftArrow.up();
  emulateKey.backspace();
  ...
</script>
```
[-> complete plain html example project](test/in-plain-html-js/www/sample-form.html)

Limitations
-----------
- line navigation in multiline inputs will use character count, not character offset width and position like browsers

Dependencies
------------
none.

Browser compatibility:
----------------------
Automated tests for current Chrome and Firefox: 
[![Travis (.org)](https://img.shields.io/travis/e-hein/emulate-key-in-browser?label=travis)](https://travis-ci.org/e-hein/emulate-key-in-browser)

License:
--------
[MIT License](LICENSE)