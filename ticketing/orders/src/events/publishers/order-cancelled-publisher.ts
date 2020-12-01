import { Publisher, OrderCancelledEvent, Subjects } from "@jdbtickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}
