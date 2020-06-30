import { EventCheckController } from './event-check.controller';

const eventCheck = window['eventCheck'] = new EventCheckController();
eventCheck.init();