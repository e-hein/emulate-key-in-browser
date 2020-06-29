import { emulateKey } from 'emulate-key-in-browser';

export class EventCheckController {
  public view: {
    eventLog: HTMLPreElement,
    parentOfFirstInput: HTMLDivElement,
    firstInput: HTMLInputElement,
    parentOfSecondInput: HTMLDivElement,
    secondInput: HTMLInputElement,
    button: HTMLButtonElement,
    control: {
      container: HTMLDivElement,
      shift: HTMLDivElement,
      tab: HTMLDivElement,
      shiftTab: HTMLDListElement,
    }
  };

  private cleanupTasks = new Array<() => PromiseLike<any> | any>();
  private get isShiftActive() {
    return this.view.control.container.classList.contains('shift');
  }
  private set isShiftActive(isActive: boolean) {
    const classList = this.view.control.container.classList;
    if (isActive) {
      classList.add('shift');
    } else {
      classList.remove('shift');
    }
  }
  
  constructor(
    private parent = document,
  ) {
    this.view = {
      eventLog: this.getElementById('event-log'),
      parentOfFirstInput: this.getElementById('parent-of-first-input'),
      firstInput: this.getElementById('first-input'),
      parentOfSecondInput: this.getElementById('parent-of-second-input'),
      secondInput: this.getElementById('second-input'),
      button: this.getElementById('button'),
      control: {
        container: this.getElementById('controls'),
        shift: this.getElementById('control-shift'),
        tab: this.getElementById('control-tab'),
        shiftTab: this.getElementById('control-shift-tab')
      }
    };
  }

  private getElementById(id: string): any {
    const element = this.parent.getElementById(id);
    if (!element) {
      throw new Error(`element with id '${id}' not found`);
    }
    return element;
  }

  public init() {
    this.initEvents();
    this.initControls();
  }

  private initEvents() {
    this.logAllKeyboardEventsOF(this.view.secondInput);
    this.logAllKeyboardEventsOF(this.view.parentOfSecondInput);
    this.logAllKeyboardEventsOF(this.view.firstInput);
    this.logAllKeyboardEventsOF(this.view.parentOfFirstInput);
  }

  private logAllKeyboardEventsOF(element: HTMLElement) {
    const keyOfEvent = (ev: KeyboardEvent) => ev.code;
    this.logEvent('keydown', keyOfEvent).of(element);
    this.logEvent('keypress', keyOfEvent).of(element);
    this.logEvent('keyup', keyOfEvent).of(element);

    const keyOfFocusEvent = (ev: FocusEvent) => ev.type;
    this.logEvent('blur', keyOfFocusEvent).of(element);
    this.logEvent('focus', keyOfFocusEvent).of(element);
  }

  private logEvent = (eventType: string, getValue: (event: Event) => string) => ({ of: (element: HTMLElement) => {
    const listener = (event: Event) => {
      const msg = `${element.id} (${eventType}): ${getValue(event)}`;
      console.log(msg, event);
      this.view.eventLog.innerHTML += msg + '\n';
    };
    element.addEventListener(eventType, listener);
    this.cleanupTasks.push(() => element.removeEventListener(eventType, listener));
  }});

  private initControls() {
    const control = this.view.control;
    control.tab.onmouseover = () => {
      console.log('emulate tab');
      emulateKey.tab();
    }
    control.shiftTab.onmouseover = () => {
      console.log('emulate shift tab');
      emulateKey.shiftTab();
    }
    control.shift.onmouseover = () => {
      this.isShiftActive = !this.isShiftActive;
    }
  }
}

export default "bla";