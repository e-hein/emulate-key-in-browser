import { getCurrentSpecResult } from '@app/testing/testbed';

describe('get spec result', () => {
  it('should fail', () => {
    fail('!');
  });

  afterEach(() => {
    const result = getCurrentSpecResult();
    const failed = result.failedExpectations?.pop();
    expect(failed).toBeTruthy();
  });
});
