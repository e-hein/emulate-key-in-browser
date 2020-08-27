[![npm (tag)](https://img.shields.io/npm/v/emulate-key-in-browser/latest)](https://www.npmjs.com/package/emulate-key-in-browser)
[![Travis (.org)](https://img.shields.io/travis/emulate-key/emulate-key-in-browser?label=travis)](https://travis-ci.org/emulate-key/emulate-key-in-browser)

emulate key in browser
======================
Tries to emulate browser reaction for special keys like tab, arrows or backspace.

This helps testing behavior of components in unit tests (e.g. with jasmine or jest) without the need to launch a test enviroment and real browser (e.g. webdriver). Be aware that this sould not replace your real browser tests, but it will simplify early behavior tests.

Interactive demo: https://emulate-key-in-browser.net-root.de

Installation
------------
```npm i emulate-key-in-browser```  
or download unpackaged javascript files from our [releases](https://github.com/emulate-key/emulate-key-in-browser/releases)

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
- selection in multiline inputs
  - line navigation will use character count, not character offset width and position like browsers
  - there are environmen specific behaviors when hitting the cursor with arrow down or up key.
    (see [emulate-shift-arrows-spec](./test/in-angular-material/src/testing/emulate-shift-arrows.shared-spec.ts) for details)
- tab to elements with scrollbars  
  Firefox selects elements that are not selectable as soon as they get scrollbars (overflow: auto) - not decided yet how to handle that. Current behavior is to ignore them.

Dependencies
------------
[emulate-tab](https://www.npmjs.com/package/emulate-tab)

Browser compatibility:
----------------------
There are automated tests for emulating keys in Chrome and Firefox. There are also automated tests that check the behavior of Chrome is equal (except multi line arrow key selection) to the emulated behavior. There's more information in our [TESTING_CONCEPT.md](./test/TESTING_CONCEPT.md).

Automated tests for the latestest emulate-key-in-browser version are currently: 
[![Travis (.org)](https://img.shields.io/travis/emulate-key/emulate-key-in-browser?label=travis)](https://travis-ci.org/emulate-key/emulate-key-in-browser)

License:
--------
[MIT License](LICENSE)