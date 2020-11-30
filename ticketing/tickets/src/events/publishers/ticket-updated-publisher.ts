import { Publisher, Subjects, TicketUpdatedEvent } from '@jdbtickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

