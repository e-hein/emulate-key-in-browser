export function waitFor(description: string, test: () => boolean, retryDelay = [0, 1, 5, 10, 20, 100, 200, 500, 1000]) {
  let currentTry = 0;
  const waitLonger = (done) => {
    const ready = test();
    if (ready) return done();
    /* istanbul ignore if */
    if (currentTry > 3) {
      console.log(description + ' not ready (' + (currentTry + 1) + ')');
    }
    const delay = retryDelay[currentTry++];
    /* istanbul ignore if */
    if (typeof delay !== 'number') {
      throw new Error(`failed to wait for ${description} (tested ${currentTry} times)`);
    }
    setTimeout(() => waitLonger(done), delay);
  }
  return new Promise(resolve => waitLonger(resolve));
}
