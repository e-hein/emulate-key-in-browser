import { emulateKey } from 'emulate-key-in-browser';
import { EventCheckController, EventCheckControls, EventCheckView } from './event-check.controller';
import { waitFor } from './wait-for.controller';

describe('event check', () => {
  let eventCheck: EventCheckController;
  let control: EventCheckControls;
  let view: EventCheckView;

  function getEventLog(): string {
    return eventCheck.view.eventLog.innerHTML;
  }
  
  beforeAll(() => {
    fixture.setBase('src');
    document.body.appendChild(fixture.el);
  });

  beforeEach(() => {
    fixture.cleanup();
    fixture.load('event-check.html');
    eventCheck = new EventCheckController();
    eventCheck.init();
    control = eventCheck.view.control;
    view = eventCheck.view;
    return waitFor('css', () => {
      return view.hiddenInput && view.hiddenInput.offsetHeight === 0;
    });
  });

  afterEach(() => {
    eventCheck.destroy();
  });

  it('should start', () => expect().nothing());

  describe('after hover tab', () => {
    shouldLog();
    beforeEach(() => emulateKey.mouse.hover(control.tab));

    it('should focus first input', () => expect(document.activeElement).toBe(view.firstInput));
  });

  describe('after hover shift-tab', () => {
    beforeEach(() => emulateKey.mouse.hover(control.shiftTab));

    it('should focus first input', () => expect(document.activeElement).toBe(view.button))
  });

  describe('after focus first input', () => {

    beforeEach(() => {
      view.firstInput.focus();
    });

    it('should focus first input', () => expect(document.activeElement).toBe(view.firstInput));
    describe('and hover write-a', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(control.writeA));
  
      it('should write "a" into first input', () => expect(view.firstInput.value).toBe('a'));
    });

    describe('and write "abc"', () => {
      shouldLog();
      beforeEach(async () => {
        await emulateKey.mouse.hover(control.writeA);
        await emulateKey.mouse.hover(control.writeB);
        await emulateKey.mouse.hover(control.writeC);
      });
  
      it('should write "abc" into first input', () => expect(view.firstInput.value).toBe('abc'));
    });

    describe('and hover write-b', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(control.writeB));
  
      it('should write "b" into first input', () => expect(view.firstInput.value).toBe('b'));
    });

    describe('and hover write-c', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(control.writeC));
  
      it('should write "c" into first input', () => expect(view.firstInput.value).toBe('c'));
    });

    describe('and hover write-leeroy', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(control.writeLeeroy));
  
      it('should write "Leeroy" into first input', () => expect(view.firstInput.value).toBe('Leeroy'));
    });

    describe('and hover write-jenkins', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(control.writeJenkins));
  
      it('should write "Jenkins" into first input', () => expect(view.firstInput.value).toBe('Jenkins'));
    });

    describe('and hover write-lorem-ipsum', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(control.writeLoremIpsum));
  
      it('should write lorem ipsum into first input', () => {
        expect(view.firstInput.value).toEqual(jasmine.stringMatching(/^Lorem ipsum.{100,}/));
      });
    });

    describe('then writing abc', () => {
      beforeEach(() => view.firstInput.value = 'abc');

      describe('and hover arrow-left', () => {
        shouldLog();
        beforeEach(() => emulateKey.mouse.hover(control.arrowLeft));

        it('should move cursor before "c"', () => {
          expect(view.firstInput.selectionStart).toBe(2, 'start');
          expect(view.firstInput.selectionEnd).toBe(2, 'end');
          expect(view.firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
        });
      });

      describe('and hover arrow-up', () => {
        shouldLog();
        beforeEach(() => emulateKey.mouse.hover(control.arrowUp));

        it('should move cursor to the beginning', () => {
          expect(view.firstInput.selectionStart).toBe(0, 'start');
          expect(view.firstInput.selectionEnd).toBe(0, 'end');
          expect(view.firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
        });
      });

      describe('then moving cursor after a', () => {
        beforeEach(() => {
          view.firstInput.selectionStart = view.firstInput.selectionEnd = 1;
        });

        describe('and hover arrow-right', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(control.arrowRight));
  
          it('should move cursor behind "b"', () => {
            expect(view.firstInput.selectionStart).toBe(2, 'start');
            expect(view.firstInput.selectionEnd).toBe(2, 'end');
            expect(view.firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
          });
        });

        describe('and hover arrow-down', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(control.arrowDown));
  
          it('should move cursor to the end', () => {
            expect(view.firstInput.selectionStart).toBe(3, 'start');
            expect(view.firstInput.selectionEnd).toBe(3, 'end');
            expect(view.firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
          });
        });

        describe('and hover backspace', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(control.backspace));

          it('should remove "a"', () => {
            expect(view.firstInput.value).toBe('bc', 'value');
            expect(view.firstInput.selectionStart).toBe(0, 'start');
            expect(view.firstInput.selectionEnd).toBe(0, 'end');
            expect(view.firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
          });
        });

        describe('and hover delete', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(control.delete));

          it('should remove "b"', () => {
            expect(view.firstInput.value).toBe('ac', 'value');
            expect(view.firstInput.selectionStart).toBe(1, 'start');
            expect(view.firstInput.selectionEnd).toBe(1, 'end');
            expect(view.firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
          });
        });
      });
    })
  });

  describe('after hover shift', () => {
    beforeEach(() => emulateKey.mouse.hover(control.shift));

    it('should *not* show control tab', () => expect(control.tab.offsetHeight).toBe(0));
    it('should show control shift-tab', () => expect(control.shiftTab.offsetHeight).toBeGreaterThan(0));
    it('should *not* show control backspace', () => expect(control.backspace.offsetHeight).toBe(0));
    it('should show control delete', () => expect(control.delete.offsetHeight).toBeGreaterThan(0));

    describe('twice', () => {
      beforeEach(() => emulateKey.mouse.hover(control.shift));

      it('should show control tab', () => expect(control.tab.offsetHeight).toBeGreaterThan(0));
      it('should *not* show control shift-tab', () => expect(control.shiftTab.offsetHeight).toBe(0));
      it('should show control backspace', () => expect(control.backspace.offsetHeight).toBeGreaterThan(0));
      it('should *not* show control delete', () => expect(control.delete.offsetHeight).toBe(0));  
    })

    describe(', focus first input', () => {

      beforeEach(() => view.firstInput.focus());
      
      describe('and hover write-a', () => {
        shouldLog();
        beforeEach(() => emulateKey.mouse.hover(control.writeA));
    
        it('should write "a" into first input', () => expect(view.firstInput.value).toBe('A'));
      });

      describe('and hover write-b', () => {
        shouldLog();
        beforeEach(() => emulateKey.mouse.hover(control.writeB));
    
        it('should write "b" into first input', () => expect(view.firstInput.value).toBe('B'));
      });

      describe('and hover write-c', () => {
        shouldLog();
        beforeEach(() => emulateKey.mouse.hover(control.writeC));
    
        it('should write "c" into first input', () => expect(view.firstInput.value).toBe('C'));
      });

      describe('then writing abc', () => {
        beforeEach(() => view.firstInput.value = 'abc');
  
        describe('and hover arrow-left', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(control.arrowLeft));
  
          it('should select "c"', () => {
            expect(view.firstInput.selectionStart).toBe(2, 'start');
            expect(view.firstInput.selectionEnd).toBe(3, 'end');
            expect(view.firstInput.selectionDirection).toBe('backward', 'direction');
          });
        });
  
        describe('and hover arrow-up', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(control.arrowUp));
  
          it('should select all up to the beginning', () => {
            expect(view.firstInput.selectionStart).toBe(0, 'start');
            expect(view.firstInput.selectionEnd).toBe(3, 'end');
            expect(view.firstInput.selectionDirection).toBe('backward', 'direction');
          });
        });
  
        describe('then moving cursor after a', () => {
          beforeEach(() => {
            view.firstInput.selectionStart = view.firstInput.selectionEnd = 1;
          });
  
          describe('and hover arrow-right', () => {
            shouldLog();
            beforeEach(() => emulateKey.mouse.hover(control.arrowRight));
    
            it('should select "b"', () => {
              expect(view.firstInput.selectionStart).toBe(1, 'start');
              expect(view.firstInput.selectionEnd).toBe(2, 'end');
              expect(view.firstInput.selectionDirection).toBe('forward', 'direction');
            });
          });
  
          describe('and hover arrow-down', () => {
            shouldLog();
            beforeEach(() => emulateKey.mouse.hover(control.arrowDown));
    
            it('should select all to the end', () => {
              expect(view.firstInput.selectionStart).toBe(1, 'start');
              expect(view.firstInput.selectionEnd).toBe(3, 'end');
              expect(view.firstInput.selectionDirection).toBe('forward', 'direction');
            });
          });
        });
      });
    });
  });

  describe('after emulating tab', () => {
    beforeEach(() => {
      eventCheck.view.firstInput.focus();
      emulateKey.mouse.hover(eventCheck.view.control.tab);
      return new Promise(done => setTimeout(done, 10));
    });

    it('should have triggered all events', () => {
      const actualEventLog = normalizeEventLog(getEventLog());
      const expectedEventLog = normalizeEventLog(`
        first-input (focus): focus
        first-input (keydown): Tab
        parent-of-first-input (keydown): Tab
        first-input (blur): blur
        second-input (focus): focus
        second-input (keyup): Tab
        parent-of-second-input (keyup): Tab
      `);
      expect(actualEventLog).toEqual(expectedEventLog);
      expect(eventCount(actualEventLog)).toEqual(eventCount(expectedEventLog));
    });
  });
});

function normalizeEventLog(log: string) {
  let normalized = log.split(/(\s*\n)+\s*/).join('');
  if (!normalized.startsWith('\n')) {
    normalized = '\n' + normalized;
  }
  return normalized;
}

function eventCount(normalizedLog: string) {
  return normalizedLog.split('\n').length - 1;
}

function shouldLog<Fn>(matcher?: jasmine.MatchableArgs<Fn>[]) {
  let origLog;
  let logSpy;

  beforeEach(() => {
    origLog = console.log;
    logSpy = spyOn(console, 'log');
  });

  afterEach(() => {
    console.log = origLog;
    if (matcher) {
      expect(logSpy).toHaveBeenCalledWith(...matcher);
    } else {
      expect(logSpy).toHaveBeenCalled();
    }
  });
}
