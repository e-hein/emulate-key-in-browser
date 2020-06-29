function initIndexJs() {
  /*
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowLeft') {
      ev.preventDefault();
      emulateKey.tab.toPreviousElement();
    } else if (ev.key === 'ArrowRight') {
      ev.preventDefault();
      emulateKab.tab();
    }
  });
  */

 const eventLog = document.getElementById('event-log');
 function logEvent(el, type, getValue) {
    el.addEventListener(type, (ev) => {
      const msg = `${el.id}: ${type} ${getValue(ev)}\n`;
      console.log(msg, ev);
      eventLog.innerHTML += msg;
    });
  }
  const logKeyEvent = (el, type) => logEvent(el, type, (ev) => `"${ev.key}"`);
  const logMouseEvent = (el, type) => logEvent(el, type, (ev) => `(${ev.clientX}, ${ev.clientY}), button ${ev.button}, buttons ${ev.buttons}`);
  emulateKey.tab.findSelectableElements().forEach((el) => {
    logKeyEvent(el, 'keydown');
    logKeyEvent(el, 'keypress');
    logKeyEvent(el, 'keyup');
    // logMouseEvent(el, 'mousein');
    logMouseEvent(el, 'mouseover');
    // logMouseEvent(el, 'mouseout');
    logMouseEvent(el, 'click');
    logMouseEvent(el, 'mousedown');
    logMouseEvent(el, 'mouseup');
    logEvent(el, 'focus', (ev) => 'from ' + ev.srcElement.id);
    logEvent(el, 'blur', (ev) => 'from ' + ev.id);
  });

  const controlContainer = document.getElementById('controls')

  function isShiftActive() {
    return controlContainer.classList.contains('shift');
  }

  function enableShift() {
    controlContainer.classList.add('shift');
  }

  function disableShift() {
    controlContainer.classList.remove('shift');
  }

  const toggleShift = window.toggleShift = () => isShiftActive()
    ? disableShift()
    : enableShift()


  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Shift') toggleShift();
  });
  window.loremIpsum = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.';
  window.isShiftActive = isShiftActive;
  globalThis.isShiftActive = isShiftActive;
}


const initOnce = () => {
  initOnce = () => {};
  init();
}
