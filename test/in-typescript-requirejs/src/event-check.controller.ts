import { emulateKey } from 'emulate-key-in-browser';

export const controlIds = {
  container: 'controls',
  shift: 'control-shift',
  tab: 'control-tab',
  shiftTab: 'control-shift-tab',
  backspace: 'control-backspace',
  delete: 'control-delete',
  arrowUp: 'control-arrow-up',
  arrowLeft: 'control-arrow-left',
  arrowRight: 'control-arrow-right',
  arrowDown: 'control-arrow-down',
  writeA: 'control-write-a',
  writeB: 'control-write-b',
  writeC: 'control-write-c',
  writeLeeroy: 'control-write-leeroy',
  writeJenkins: 'control-write-jenkins',
  writeLoremIpsum: 'control-write-lorem-ipsum',
}

export const viewIds = {
  eventLog: 'event-log',
  parentOfFirstInput: 'parent-of-first-input',
  firstInput: 'first-input',
  parentOfSecondInput: 'parent-of-second-input',
  secondInput: 'second-input',
  button: 'button',
  parentOfHiddenInput: 'parent-of-hidden-input',
  hiddenInput: 'hidden-input',
}

export type EventCheckControls = {
  [key in keyof typeof controlIds]: HTMLDivElement;
};

export interface EventCheckView {
  eventLog: HTMLPreElement,
  parentOfFirstInput: HTMLDivElement,
  firstInput: HTMLInputElement,
  parentOfSecondInput: HTMLDivElement,
  secondInput: HTMLInputElement,
  button: HTMLButtonElement,
  parentOfHiddenInput: HTMLDivElement,
  hiddenInput: HTMLInputElement,
}

export class EventCheckController {
  public view: EventCheckView & {
    control: EventCheckControls,
  };

  private cleanupTasks = new Array<() => PromiseLike<any> | any>();
  private get isShiftActive() {
    return this.view.control.container.classList.contains('shift');
  }
  private set isShiftActive(isActive: boolean) {
    const classList = this.view.control.container.classList;
    if (isActive) {
      classList.add('shift');
      this.activateShiftBehavior();
    } else {
      classList.remove('shift');
      this.activateDefaultBehavior();
    }
  }
  
  constructor(
    private parent = document,
  ) {
    this.view = {
      ...this.getElementsByIds<EventCheckView>(viewIds),
      control: this.getElementsByIds<EventCheckControls>(controlIds),
    };
  }

  private getElementsByIds<U>(ids: { [key in keyof U]: string }): U {
    return Object.entries<string>(ids).reduce(
      (mapped, [key, id]) => Object.assign(mapped, { [key]: this.getElementById(id) }),
      {} as U
    );
  }

  private getElementById(id: string): any {
    const element = this.parent.getElementById(id);
    /* istanbul ignore if */
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
    control.shift.onmouseover = () => {
      this.isShiftActive = !this.isShiftActive;
    }
    control.tab.onmouseover = () => emulateKey.tab();
    control.shiftTab.onmouseover = () => emulateKey.shiftTab();
    control.backspace.onmouseover = () => emulateKey.backspace();
    control.delete.onmouseover = () => emulateKey.delete();
    control.writeLeeroy.onmouseover = () => emulateKey.writeText('Leeroy');
    control.writeJenkins.onmouseover = () => emulateKey.writeText('Jenkins');
    control.writeLoremIpsum.onmouseover = () => emulateKey.writeText(loremIpsum);
    this.activateDefaultBehavior();
  }

  private activateDefaultBehavior() {
    const control = this.view.control;
    control.arrowUp.onmouseover = () => emulateKey.arrow.up();
    control.arrowLeft.onmouseover = () => emulateKey.arrow.left();
    control.arrowRight.onmouseover = () => emulateKey.arrow.right();
    control.arrowDown.onmouseover = () => emulateKey.arrow.down();
    control.writeA.onmouseover = () => emulateKey.writeText('a');
    control.writeB.onmouseover = () => emulateKey.writeText('b');
    control.writeC.onmouseover = () => emulateKey.writeText('c');
  }

  private activateShiftBehavior() {
    const control = this.view.control;
    control.arrowUp.onmouseover = () => emulateKey.shiftArrow.up();
    control.arrowLeft.onmouseover = () => emulateKey.shiftArrow.left();
    control.arrowRight.onmouseover = () => emulateKey.shiftArrow.right();
    control.arrowDown.onmouseover = () => emulateKey.shiftArrow.down();
    control.writeA.onmouseover = () => emulateKey.writeText('A');
    control.writeB.onmouseover = () => emulateKey.writeText('B');
    control.writeC.onmouseover = () => emulateKey.writeText('C');
  }

  public destroy() {
    this.cleanupTasks.forEach((cleanUpTask) => cleanUpTask());
  }
}

const loremIpsum = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.';