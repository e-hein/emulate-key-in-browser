function waitFor(description, test, retryDelay = [0, 1, 5, 10, 20, 100, 200, 500, 1000]) {
  let currentTry = 0;
  const waitLonger = (done) => {
    const ready = test();
    if (ready) return done();
    if (currentTry > 3) {
      console.log(description + ' not ready (' + (currentTry + 1) + ')');
    }
    const delay = retryDelay[currentTry++];
    if (typeof delay !== 'number') {
      throw new Error(`failed to wait for ${description} (tested ${currentTry} times)`);
    }
    setTimeout(() => waitLonger(done), delay);
  }
  return new Promise(resolve => waitLonger(resolve));
}

let testContent;

function initIndexHtml() {
  beforeEach(() => {
    if (testContent) {
      document.body.removeChild(testContent);
    }

    testContent = document.createElement('div');
    document.body.appendChild(testContent);
    testContent.innerHTML = __html__['www/index.html'];
    return waitFor('css', () => {
      const hiddenInput = testElement(id.hiddenInput);
      return hiddenInput && hiddenInput.offsetHeight === 0;
    });
  });
}

function loadJs(name) {
  return new Promise((resolve) => {
    const request = new XMLHttpRequest();
    request.addEventListener('load', (res) => {
      resolve(res.target.responseText);
    })
    request.open('GET', './base/www/' + name);
    request.send();
  });
}

function testElement(id) {
  return document.getElementById(id);
}

function shouldLog(matcher) {
  let origLog;
  let logSpy;

  beforeEach(() => {
    origLog = console.log;
    logSpy = spyOn(console, 'log');
  });

  afterEach(() => {
    console.log = origLog;
    if (matcher) {
      expect(logSpy).toHaveBeenCalledWith(matcher);
    } else {
      expect(logSpy).toHaveBeenCalled();
    }
  });
}

const id = {
  firstInput: 'first-input',
  firstInputsParent: 'parent-of-first-input',
  secondInput: 'second-input',
  secondInputsParent: 'parent-of-second-input',
  textarea: 'textarea',
  disabledInput: 'disabled-input',
  hiddenInput: 'hidden-input',
  hiddenInputsParent: 'parent-of-hidden-input',
  button: 'button',
  control: {
    shift: 'control-shift',
    tab: 'control-tab',
    shiftTab: 'control-shift-tab',
    backspace: 'control-backspace',
    delete: 'control-delete',
    arrowUp: 'control-arrow-up',
    arrowRight: 'control-arrow-right',
    arrowDown: 'control-arrow-down',
    arrowLeft: 'control-arrow-left',
    writeA: 'control-write-a',
    writeB: 'control-write-b',
    writeC: 'control-write-c',
    writeLeeroy: 'control-write-leeroy',
    writeJenkins: 'control-write-jenkins',
    writeLoremIpsum: 'control-write-lorem-ipsum',
  },
};
