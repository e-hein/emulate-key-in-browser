import { Component, OnDestroy, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, ElementRef } from '@angular/core';
import { emulateKey } from 'emulate-key-in-browser';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

const eventsToLog: Array<keyof DocumentEventMap> = [
  'keydown', 'keypress', 'keydown',
  'focus', 'blur', 'input', 'focusin', 'focusout',
  'selectionchange', 'select', 'selectstart',
];

interface EventLogRow {
  time: number;
  recievedBy: string;
  event: Event;
  target: string;
  match?: boolean;
}

function nameOf(element: any) {
  if (element.id) { return element.id; }

  const tagName = element.tagName;
  if (typeof tagName === 'string') { return tagName.toLowerCase(); }

  if (element === document) { return 'document'; }

  return '' + element;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit, OnDestroy {
  isShiftActive = false;
  readonly loremIpsum = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.';
  readonly displayedColumns = ['recievedBy', 'type', 'target'];
  eventLog = new MatTableDataSource<EventLogRow>();
  private sample?: EventLogRow[];
  private cleanUpTasks = new Array<() => void>();
  private inputsWithListeners = new Array<any>();

  @ViewChild('firstInput') set firstInput(firstInput: ElementRef | undefined) {
    if (firstInput) { this.logEvents(firstInput.nativeElement); }
  }
  @ViewChild('secondInput') set secondInput(secondInput: ElementRef | undefined) {
    if (secondInput) { this.logEvents(secondInput.nativeElement); }
  }
  @ViewChild(MatPaginator) set newPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.eventLog.paginator = paginator;
  }
  private paginator?: MatPaginator;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.logEvents(document);
  }

  ngOnDestroy() {
    this.cleanUpTasks.forEach((cleanUpTask) => cleanUpTask());
  }

  logEvents(element?: Element | Document) {
    if (!element) { return; }
    if (this.inputsWithListeners.includes(element)) { return; }
    const elementName = nameOf(element);
    eventsToLog.forEach((eventType) => {
      const listener = (event: Event) => {
        const target = event.target as HTMLElement;
        const sample = this.sample?.[this.eventLog.data.length];
        const match = sample
          && sample.recievedBy === elementName
          && sample.event.type === event.type
          && sample.event.target === event.target
        ;
        this.eventLog.data.push({
          time: Date.now(),
          recievedBy: elementName,
          event,
          match,
          target: target.id || target.tagName || (document === event.target && 'document') || ('' + target),
        });
        this.eventLog.data = this.eventLog.data.slice();
        this.changeDetectorRef.markForCheck();
      };
      element.addEventListener(eventType, listener);
      this.cleanUpTasks.push(() => element.removeEventListener(eventType, listener));
    });
  }

  clearEventLog() {
    this.eventLog = new MatTableDataSource<EventLogRow>();
    this.eventLog.paginator = this.paginator;
  }

  saveSample() {
    this.sample = this.eventLog.data.slice();
    this.clearEventLog();
  }

  emulateShift() {
    this.isShiftActive = !this.isShiftActive;
  }

  emulateTab() {
    return emulateKey.tab.forwards();
  }

  emulateShiftTab() {
    return emulateKey.tab.backwards();
  }

  emulateBackspace() {
    return emulateKey.backspace();
  }

  emulateDelete() {
    return emulateKey.delete();
  }

  emulateArrowUp() {
    return this.isShiftActive ? emulateKey.shiftArrow.up() : emulateKey.arrow.up();
  }

  emulateArrowLeft() {
    return this.isShiftActive ? emulateKey.shiftArrow.left() : emulateKey.arrow.left();
  }
  emulateArrowRight() {
    return this.isShiftActive ? emulateKey.shiftArrow.right() : emulateKey.arrow.right();
  }
  emulateArrowDown() {
    return this.isShiftActive ? emulateKey.shiftArrow.down() : emulateKey.arrow.down();
  }

  emulateWriteText(text: string) {
    const textToWrite = this.isShiftActive
      ? text.charAt(0).toUpperCase() + text.slice(1)
      : text
    ;
    return emulateKey.writeText(textToWrite);
  }
}
