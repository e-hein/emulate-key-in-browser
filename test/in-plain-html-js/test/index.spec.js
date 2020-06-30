function itShouldContainTestElementsIn(ids) {
  Object.entries(ids).forEach(([key, id]) => {
    if (typeof id === 'string') {
      it(`should contain ${key} ("${id}")`, () => expect(document.getElementById(id)).toBeTruthy());
    } else {
      describe(`${key}`, () => itShouldContainTestElementsIn(id));
    }
  });
}

describe('interactive demo', () => {
  initIndexHtml();
  beforeEach(() => loadJs('index.js').then((code) => {
    eval(code);
    initIndexJs();
  }));

  describe('should contains test element', () => itShouldContainTestElementsIn(id));
  describe('initially', () => {
    it('should show control shift', () => expect(testElement(id.control.shift)).toBeTruthy());
    it('should *not* show shift-tab', () => expect(testElement(id.control.shiftTab).offsetHeight).toBe(0));
    it('should show control backspace', () => expect(testElement(id.control.backspace)).toBeTruthy());
    it('should *not* show control delete', () => expect(testElement(id.control.delete).offsetHeight).toBe(0));
    it('should show control arrow-up', () => expect(testElement(id.control.arrowUp)).toBeTruthy());
    it('should show control arrow-right', () => expect(testElement(id.control.arrowRight)).toBeTruthy());
    it('should show control arrow-down', () => expect(testElement(id.control.arrowDown)).toBeTruthy());
    it('should show control arrow-left', () => expect(testElement(id.control.arrowLeft)).toBeTruthy());
    it('should show control write-a', () => expect(testElement(id.control.writeA)).toBeTruthy());
    it('should show control write-b', () => expect(testElement(id.control.writeB)).toBeTruthy());
    it('should show control write-c', () => expect(testElement(id.control.writeC)).toBeTruthy());
    it('should show control write-leeroy', () => expect(testElement(id.control.writeLeeroy)).toBeTruthy());
    it('should show control write-jenkins', () => expect(testElement(id.control.writeJenkins)).toBeTruthy());
    it('should show control write-lorem-ipsum', () => expect(testElement(id.control.writeLoremIpsum)).toBeTruthy());
  });

  describe('after hover tab', () => {
    shouldLog();
    beforeEach(() => emulateKey.mouse.hover(testElement(id.control.tab)));

    it('should focus first input', () => expect(document.activeElement).toBe(testElement(id.firstInput)))
  });

  describe('after hover shift-tab', () => {
    shouldLog();
    beforeEach(() => emulateKey.mouse.hover(testElement(id.control.shiftTab)));

    it('should focus first input', () => expect(document.activeElement).toBe(testElement(id.button)))
  });

  describe('after focus first input', () => {
    let firstInput;

    beforeEach(() => {
      firstInput = testElement(id.firstInput);
      firstInput.focus();
    });

    it('should focus first input', () => expect(document.activeElement).toBe(firstInput));
    describe('and hover write-a', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(testElement(id.control.writeA)));
  
      it('should write "a" into first input', () => expect(firstInput.value).toBe('a'));
    });

    describe('and hover write-b', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(testElement(id.control.writeB)));
  
      it('should write "b" into first input', () => expect(firstInput.value).toBe('b'));
    });

    describe('and hover write-c', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(testElement(id.control.writeC)));
  
      it('should write "c" into first input', () => expect(firstInput.value).toBe('c'));
    });

    describe('and hover write-leeroy', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(testElement(id.control.writeLeeroy)));
  
      it('should write "Leeroy" into first input', () => expect(firstInput.value).toBe('Leeroy'));
    });

    describe('and hover write-jenkins', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(testElement(id.control.writeJenkins)));
  
      it('should write "Jenkins" into first input', () => expect(firstInput.value).toBe('Jenkins'));
    });

    describe('and hover write-lorem-ipsum', () => {
      shouldLog();
      beforeEach(() => emulateKey.mouse.hover(testElement(id.control.writeLoremIpsum)));
  
      it('should write lorem ipsum into first input', () => {
        expect(firstInput.value).toEqual(jasmine.stringMatching(/^Lorem ipsum.{100,}/));
      });
    });

    describe('then writing abc', () => {
      beforeEach(() => firstInput.value = 'abc');

      describe('and hover arrow-left', () => {
        shouldLog();
        beforeEach(() => emulateKey.mouse.hover(testElement(id.control.arrowLeft)));

        it('should move cursor before "c"', () => {
          expect(firstInput.selectionStart).toBe(2, 'start');
          expect(firstInput.selectionEnd).toBe(2, 'end');
          expect(firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
        });
      });

      describe('and hover arrow-up', () => {
        shouldLog();
        beforeEach(() => emulateKey.mouse.hover(testElement(id.control.arrowUp)));

        it('should move cursor to the beginning', () => {
          expect(firstInput.selectionStart).toBe(0, 'start');
          expect(firstInput.selectionEnd).toBe(0, 'end');
          expect(firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
        });
      });

      describe('then moving cursor after a', () => {
        beforeEach(() => {
          firstInput.selectionStart = firstInput.selectionEnd = 1;
        });

        describe('and hover arrow-right', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(testElement(id.control.arrowRight)));
  
          it('should move cursor behind "b"', () => {
            expect(firstInput.selectionStart).toBe(2, 'start');
            expect(firstInput.selectionEnd).toBe(2, 'end');
            expect(firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
          });
        });

        describe('and hover arrow-down', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(testElement(id.control.arrowDown)));
  
          it('should move cursor to the end', () => {
            expect(firstInput.selectionStart).toBe(3, 'start');
            expect(firstInput.selectionEnd).toBe(3, 'end');
            expect(firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
          });
        });

        describe('and hover backspace', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(testElement(id.control.backspace)));

          it('should remove "a"', () => {
            expect(firstInput.value).toBe('bc', 'value');
            expect(firstInput.selectionStart).toBe(0, 'start');
            expect(firstInput.selectionEnd).toBe(0, 'end');
            expect(firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
          });
        });

        describe('and hover delete', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(testElement(id.control.delete)));

          it('should remove "b"', () => {
            expect(firstInput.value).toBe('ac', 'value');
            expect(firstInput.selectionStart).toBe(1, 'start');
            expect(firstInput.selectionEnd).toBe(1, 'end');
            expect(firstInput.selectionDirection).toEqual(jasmine.stringMatching(/none|forward/), 'direction');
          });
        });
      });
    })
  });

  describe('after hover shift', () => {
    beforeEach(() => emulateKey.mouse.hover(testElement(id.control.shift)));

    it('should *not* show control tab', () => expect(testElement(id.control.tab).offsetHeight).toBe(0));
    it('should show control shift-tab', () => expect(testElement(id.control.shiftTab).offsetHeight).toBeGreaterThan(0));
    it('should *not* show control backspace', () => expect(testElement(id.control.backspace).offsetHeight).toBe(0));
    it('should show control delete', () => expect(testElement(id.control.delete).offsetHeight).toBeGreaterThan(0));

    describe('twice', () => {
      beforeEach(() => emulateKey.mouse.hover(testElement(id.control.shift)));
  
      it('should show control tab', () => expect(testElement(id.control.tab).offsetHeight).toBeGreaterThan(0));
      it('should *not* show control shift-tab', () => expect(testElement(id.control.shiftTab).offsetHeight).toBe(0));
      it('should show control backspace', () => expect(testElement(id.control.backspace).offsetHeight).toBeGreaterThan(0));
      it('should *not* show control delete', () => expect(testElement(id.control.delete).offsetHeight).toBe(0));
    });

    describe(', focus first input', () => {
      let firstInput;

      beforeEach(() => {
        firstInput = testElement(id.firstInput);
        firstInput.focus();
      });
      
      describe('and hover write-a', () => {
        shouldLog();
        beforeEach(() => emulateKey.mouse.hover(testElement(id.control.writeA)));
    
        it('should write "a" into first input', () => expect(firstInput.value).toBe('A'));
      });

      describe('and hover write-b', () => {
        shouldLog();
        beforeEach(() => emulateKey.mouse.hover(testElement(id.control.writeB)));
    
        it('should write "b" into first input', () => expect(firstInput.value).toBe('B'));
      });

      describe('and hover write-c', () => {
        shouldLog();
        beforeEach(() => emulateKey.mouse.hover(testElement(id.control.writeC)));
    
        it('should write "c" into first input', () => expect(firstInput.value).toBe('C'));
      });

      describe('then writing abc', () => {
        beforeEach(() => firstInput.value = 'abc');
  
        describe('and hover arrow-left', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(testElement(id.control.arrowLeft)));
  
          it('should select "c"', () => {
            expect(firstInput.selectionStart).toBe(2, 'start');
            expect(firstInput.selectionEnd).toBe(3, 'end');
            expect(firstInput.selectionDirection).toBe('backward', 'direction');
          });
        });
  
        describe('and hover arrow-up', () => {
          shouldLog();
          beforeEach(() => emulateKey.mouse.hover(testElement(id.control.arrowUp)));
  
          it('should select all up to the beginning', () => {
            expect(firstInput.selectionStart).toBe(0, 'start');
            expect(firstInput.selectionEnd).toBe(3, 'end');
            expect(firstInput.selectionDirection).toBe('backward', 'direction');
          });
        });
  
        describe('then moving cursor after a', () => {
          beforeEach(() => {
            firstInput.selectionStart = firstInput.selectionEnd = 1;
          });
  
          describe('and hover arrow-right', () => {
            shouldLog();
            beforeEach(() => emulateKey.mouse.hover(testElement(id.control.arrowRight)));
    
            it('should select "b"', () => {
              expect(firstInput.selectionStart).toBe(1, 'start');
              expect(firstInput.selectionEnd).toBe(2, 'end');
              expect(firstInput.selectionDirection).toBe('forward', 'direction');
            });
          });
  
          describe('and hover arrow-down', () => {
            shouldLog();
            beforeEach(() => emulateKey.mouse.hover(testElement(id.control.arrowDown)));
    
            it('should select all to the end', () => {
              expect(firstInput.selectionStart).toBe(1, 'start');
              expect(firstInput.selectionEnd).toBe(3, 'end');
              expect(firstInput.selectionDirection).toBe('forward', 'direction');
            });
          });
        });
      });
    });
  });
});