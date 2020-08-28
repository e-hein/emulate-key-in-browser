import {
  testEmulateArrowAfterSelection, testEmulateArrows,
  testEmulateBackspace, testEmulateDelete, testEmulateShiftArrows, testEmulateTab, testEmulateWritingText, testSharedSpecContext
} from '@app/testing';
import { SharedSpecContextWithProtractorKeys } from '@app/testing/protractor';
import { browser } from 'protractor';
import { expectNoErrorLogs } from './utils';

describe('emulate key', () => {
  const context = new SharedSpecContextWithProtractorKeys();

  beforeEach(async () => {
    await browser.get('/');
    await context.refreshContext();
  });

  describe('shared spec context', () => testSharedSpecContext(context));
  describe('tab', () => testEmulateTab(context));

  if (process.env.capability_simulateArrowKeys) {
    describe('arrow', () => testEmulateArrows(context));
    describe('shift arrow', () => testEmulateShiftArrows(context));
    describe('arrow after selection', () => testEmulateArrowAfterSelection(context));
  }

  describe('backspace', () => testEmulateBackspace(context));
  describe('delete', () => testEmulateDelete(context));
  describe('writing text', () => testEmulateWritingText(context));

  afterEach(async () => {
    expectNoErrorLogs();
  });
});
