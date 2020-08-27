import { TestBed } from '@angular/core/testing';
import {
  testEmulateArrowAfterSelection, testEmulateArrows,
  testEmulateBackspace, testEmulateDelete, testEmulateShiftArrows, testEmulateTab,
  testEmulateWritingText,
  testSharedSpecContext,
} from '@app/testing';
import { SharedSpecContextWithFixture } from '@app/testing/testbed';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('emulate key in browser', () => {
  const context = new SharedSpecContextWithFixture();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
    await context.updateFixture(TestBed.createComponent(AppComponent));
  });

  describe('shared spec context', () => testSharedSpecContext(context));
  describe('tab', () => testEmulateTab(context));
  describe('arrows', () => testEmulateArrows(context));
  describe('shift arrow', () => testEmulateShiftArrows(context));
  describe('arrow after selection', () => testEmulateArrowAfterSelection(context));
  describe('backspace', () => testEmulateBackspace(context));
  describe('delete', () => testEmulateDelete(context));
  describe('writing text', () => testEmulateWritingText(context));
});
