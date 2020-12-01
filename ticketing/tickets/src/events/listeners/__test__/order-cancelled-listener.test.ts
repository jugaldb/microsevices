import { Message } from "node-nats-streaming";
import mongoose, { mongo } from "mongoose";
import { OrderCancelledEvent, OrderStatus } from "@jdbtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledListener } from "../order-cancelled-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString()
  const ticket = Ticket.build({
    title: "Concert",
    price: 100,
    userId: "asdasda",
  });
  ticket.set({ orderId })
  await ticket.save();
  // create a fake data event
  const data: OrderCancelledEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket, orderId };
};

it("unsets the orderId of the ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a order was created!
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("acks the message", async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it("Publishes a ticket updated event", async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
