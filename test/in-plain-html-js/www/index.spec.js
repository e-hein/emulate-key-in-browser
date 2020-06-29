function waitFor(description, test, retryLimit = 20, milliseconsBetweenRetries = 200) {
  let currentTry = 1;
  const waitLonger = (done) => {
    const ready = test();
    if (ready) return done();
    if (currentTry > 3) {
      console.log('css not ready (' + currentTry + ')');
    }
    if (++currentTry > retryLimit) {
      throw new Error('failed to wait for ' + description);
    }
    setTimeout(() => waitLonger(done), milliseconsBetweenRetries);
  }
  return new Promise(resolve => waitLonger(resolve));
}

describe('sample form', () => {
  const testContent = document.createElement('div');

  beforeAll(() => {
    document.body.appendChild(testContent);
  });

  beforeEach(() => {
    testContent.innerHTML = __html__['index.html'];
  }, 10000);

  it('should find expected inputs (and not hidden/disabled...)', () => {
    const selectableElementIds = emulateKey.tab.findSelectableElements().map((e) => e.id || e.className);
    expect(selectableElementIds).toEqual([
      'first-input',
      'second-input',
      'jasmine-title',
      'textarea',
      'button',
    ]);
  });

  itShouldTabFrom('first-input').to('second-input');

  describe('advanced api', () => {
    let firstInput;
    let secondInput;
    let lastInput;
    let otherInput;

    beforeEach(() => {
      firstInput = document.getElementById('first-input');
      secondInput = document.getElementById('second-input');
      lastInput = document.getElementById('button');
      otherInput = document.getElementById('textarea');

      if ([firstInput, secondInput, lastInput].includes(undefined)) {
        const msg = 'did not found all test inputs';
        console.error(msg, { firstInput, secondInput, lastInput, otherInput });
        throw new Error(msg);
      }
    });

    it('tab from given element to next element', async () => {
      // given
      otherInput.focus();
      const keySpy = jasmine.createSpy('keydown');
      const blurSpy = spyOn(firstInput, 'blur').and.callThrough();
      const secondFocusSpy = spyOn(secondInput, 'focus').and.callThrough();
      const keydownListener = (ev) => {
        expect(blurSpy).not.toHaveBeenCalled();
        expect(secondFocusSpy).not.toHaveBeenCalled();
        keySpy(ev);
      }
      firstInput.addEventListener('keydown', keydownListener);

      // when
      await emulateKey.tab.from(firstInput).toNextElement();

      // then
      expect(keySpy).toHaveBeenCalled();
      expect(blurSpy).toHaveBeenCalled();
      expect(secondFocusSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(secondInput);

      // cleanup
      firstInput.removeEventListener('keydown', keydownListener);
    });

    it('tab from given element to given element', async () => {
      // given
      otherInput.focus();
      const keySpy = jasmine.createSpy('keydown');
      const blurSpy = spyOn(firstInput, 'blur').and.callThrough();
      const focusSpy = spyOn(lastInput, 'focus').and.callThrough();
      const keydownListener = (ev) => {
        expect(blurSpy).not.toHaveBeenCalled();
        expect(focusSpy).not.toHaveBeenCalled();
        keySpy(ev);
      }
      firstInput.addEventListener('keydown', keydownListener);

      // when
      await emulateKey.tab.from(firstInput).to(lastInput);

      // then
      expect(keySpy).toHaveBeenCalled();
      expect(blurSpy).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(lastInput);

      // cleanup
      firstInput.removeEventListener('keydown', keydownListener);
    });

    it('tab to next element', async () => {
      // given
      firstInput.focus();
      const keySpy = jasmine.createSpy('keydown');
      const blurSpy = spyOn(firstInput, 'blur').and.callThrough();
      const focusSpy = spyOn(secondInput, 'focus').and.callThrough();
      const keydownListener = (ev) => {
        expect(blurSpy).not.toHaveBeenCalled();
        expect(focusSpy).not.toHaveBeenCalled();
        keySpy(ev);
      }
      firstInput.addEventListener('keydown', keydownListener);

      // when
      await emulateKey.tab.toNextElement();

      // then
      expect(keySpy).toHaveBeenCalled();
      expect(blurSpy).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(secondInput);

      // cleanup
      firstInput.removeEventListener('keydown', keydownListener);
    });

    it('tab to given element', async () => {
      // given
      firstInput.focus();
      const keySpy = jasmine.createSpy('keydown');
      const blurSpy = spyOn(firstInput, 'blur').and.callThrough();
      const focusSpy = spyOn(lastInput, 'focus').and.callThrough();
      const keydownListener = (ev) => {
        expect(blurSpy).not.toHaveBeenCalled();
        expect(focusSpy).not.toHaveBeenCalled();
        keySpy(ev);
      }
      firstInput.addEventListener('keydown', keydownListener);

      // when
      await emulateKey.tab.to(lastInput);

      // then
      expect(keySpy).toHaveBeenCalled();
      expect(blurSpy).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(lastInput);

      // cleanup
      firstInput.removeEventListener('keydown', keydownListener);
    });

    it('tab backwards', async () => {
      // given
      secondInput.focus();
      const keySpy = jasmine.createSpy('keydown');
      const blurSpy = spyOn(secondInput, 'blur').and.callThrough();
      const focusSpy = spyOn(firstInput, 'focus').and.callThrough();
      const keydownListener = (ev) => {
        expect(blurSpy).not.toHaveBeenCalled();
        expect(focusSpy).not.toHaveBeenCalled();
        keySpy(ev);
      }
      secondInput.addEventListener('keydown', keydownListener);

      // when
      await emulateKey.tab.backwards();

      // then
      expect(keySpy).toHaveBeenCalled();
      expect(blurSpy).toHaveBeenCalled();
      expect(focusSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(firstInput);

      // cleanup
      firstInput.removeEventListener('keydown', keydownListener);
    });

    it('tab previous element', async () => {
      // given
      secondInput.focus();
      const keySpy = jasmine.createSpy('keydown');
      const blurSpy = spyOn(secondInput, 'blur').and.callThrough();
      const focusSpy = spyOn(firstInput, 'focus').and.callThrough();
      const keydownListener = (ev) => {
        expect(blurSpy).not.toHaveBeenCalled();
        expect(focusSpy).not.toHaveBeenCalled();
        keySpy(ev);
      }
      secondInput.addEventListener('keydown', keydownListener);

      // when
      await emulateKey.tab.toPreviousElement();

      // then
      expect(keySpy).toHaveBeenCalled();
      expect(blurSpy).toHaveBeenCalled();
      expect(document.activeElement).toBe(firstInput);
      expect(focusSpy).toHaveBeenCalled();

      // cleanup
      firstInput.removeEventListener('keydown', keydownListener);
    });
  });
});

function itShouldTabFrom(sourceId) {
  return {
    to: (targetId) => {
      it (`should tab from "${sourceId}" to "${targetId}"`, async () => {
        // given
        const source = document.getElementById(sourceId);
        if (!source) throw new Error(`could not find source element with id "${sourceId}"`)
        source.focus();

        const target = document.getElementById(targetId);
        if (!target) throw new Error(`could not find target element with id "${targetId}"`)
        
        // when
        await emulateKey.tab();

        // then
        expect(document.activeElement.id).toBe(target.id, 'element after emulateTab');
      })
    },
  };
}
