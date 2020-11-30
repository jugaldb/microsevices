import { Publisher, Subjects, TicketCreatedEvent } from '@jdbtickets/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
