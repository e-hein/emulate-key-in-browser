import { EventCheckController } from "./event-check.controller";
import { waitFor } from './wait-for.controller';

xdescribe('demo app', () => {
  let appFrame: HTMLIFrameElement;
  let eventCheck: EventCheckController;

  function getEventLog(): string {
    return eventCheck.view.eventLog.innerHTML;
  }

  beforeEach((done) => {
    fixture.cleanup();
    document.body.removeChild(fixture.el);
    appFrame = document.createElement('iframe');
    appFrame.id = 'app-frame';
    appFrame.src = '/app/';
    appFrame.style.width = '100%';
    appFrame.style.height = '100vh';
    const loadedListener = () => {
      appFrame.removeEventListener('load', loadedListener);
      waitFor('event check', () => !!(eventCheck = appFrame.contentWindow['eventCheck'])).then(done);
    };
    appFrame.addEventListener('load', loadedListener);
    fixture.el.appendChild(appFrame);
    document.body.appendChild(fixture.el);
  })

  it('should contain event check', () => expect(eventCheck).toBeTruthy());

  describe('initially', () => {
    it('log should be empty', () => expect(getEventLog()).toEqual(''));
  });
});