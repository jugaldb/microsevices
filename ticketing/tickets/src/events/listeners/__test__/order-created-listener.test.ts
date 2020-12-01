import { Message } from "node-nats-streaming";
import mongoose from "mongoose";
import { OrderCreatedEvent, OrderStatus } from "@jdbtickets/common";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  // create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: "Concert",
    price: 100,
    userId: "asdasda",
  });

  await ticket.save();
  // create a fake data event
  const data: OrderCreatedEvent["data"] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: "asdas",
    userId: "asdasda",
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("sets the orderId of the ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a order was created!
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
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
  const dataUpdated = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(dataUpdated.orderId).toEqual(data.id);
});
