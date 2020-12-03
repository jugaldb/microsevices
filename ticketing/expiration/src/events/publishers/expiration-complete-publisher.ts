import {
  Subjects,
  Publisher,
  ExpirationCompleteEvent,
} from '@jdbtickets/common';

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
