Testing Concept for [emulate-keys-in-browser](../README.md)
=============================================

Test and example applications
-----------------------------
There are multiple test and example applications. Each of them ensures the integration of ```emulateKey``` works as expected and provides some basic specs. Tests of (nearly) all the code are done in [test/in-angular-material](./in-angular-material).

* [test/in-plain-html-js](./in-plain-html-js) integrates ```emulateKey``` by loading the ```emulate-key-in-brower.js```
* [test/in-typescript-requirejs](./in-typescript-requirejs) integrates ```emulateKey``` by loading the amd module
* [test/in-angular-material](./in-angular-material) integrates ```emulateKey``` by bundling the ECMAScript Module file during.

Testing each key
----------------
As mentioned above this is done in [test/in-angular-material](./in-angular-material). There are [multiple spec](./in-angular-material/src/testing) files to structure the tests. They do not test ```emulateKey``` (which is synchronous) directly, but wrap it into a [shared-spec-context](./in-angular-material/src/testing/shared-spec-context.model.ts). This shared context has different benefits:

- in the unit test environment (Testbed) they ensure that the page is stable and all changes are done before checking results
- in the e2e test environment (Protractor/WebDriver) the emulation is replaced by sending keys to the browser

That way it always checks the emulation for those tests in the unit test environment and that the spec itself expects the behavior of the browser in the e2e environment.  
This works really great for Chrome, so all emulated actions will act like Chrome.

Issues
------

### Issues concerning the selection in multiline inputs
There are some issues concerning the selection in multiline inputs. That are really rare edge cases so I don't care about them:
- depending on font size, character widths, word length and line breaks it's hard to determine real line so emulation will always jump by the amount of cols.
- there are two different behaviors when selecting over the end of an existing selection with the arrow down and arrow up keys. I could not determine exactly which browsers on which os use which behavior and decided to use the special behavior (A) for those cases. In detail:  
  - Given: There's an existing selection forward which is shorter than one line
  - When: The user hits ```shift + arrow up```
  - Then:
    - Behavior A): It won't change selection by one line, but remove selection and set the cursor to the former start of the selection. Selection direction may change to none (Chrome) or stay forward (firefox)
    - Behavior B): It will change selection by one line, so the former start of the selection is now the end of the new selection and it will select the remaining characters before the cursor. Selection direction changes from forward to backward.

### Issues of e2e behavior tests in firefox
- selenium 3.6 stills sends the old mouse actions, but firefox expects new w3c actions.  
  selenium 4.x is not stable yet (for 3 years now) and as long as angular uses selenium 3.6 I see no way to use 4.x  
  --> all specs using mouse interaction (mainly ui specs) can't run in e2e with firefox
- sending an arrow through the WebDriver protocol may result in multiple arrows. e.g.:
  - cursor is in the middle of an text input and sending ```arrow right``` will jump to the end of the text field
  - cursor is in the first line of a multiline input with more than 5 lines ```arrow down``` will jump to the end
- sending shift + arrow through the WebDriver protocol won't select anything.
- sending a character through the WebDriver protocol into an input with the cursor position 0 (start of the input) will append this character at the end of the input (real typing would insert it at the beginning). It's even the same behavior with ```delete``` (won't delete the first character) and ```backspace``` (will delete the last character).

Of course it's possible to trigger emulateKey in e2e tests (by executeScript) to work around those issues - but this would not test firefox behavior anymore.