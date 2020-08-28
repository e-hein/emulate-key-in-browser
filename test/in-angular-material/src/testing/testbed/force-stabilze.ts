import { ComponentFixture } from '@angular/core/testing';

export async function forceStabilize<T>(fixture: ComponentFixture<any> | undefined, after: () => T): Promise<T> {
  /* istanbul ignore if */
  if (!fixture) {
    throw new Error('cannot stabilize without fixture');
  }
  const result = after();
  fixture.detectChanges();
  await fixture.whenStable();
  return result;
}
