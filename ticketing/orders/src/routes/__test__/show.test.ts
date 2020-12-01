import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import mongoose from 'mongoose'

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  return ticket;
};

it("fetches orders for an particular user", async () => {
  // Create three tickets
  const ticketOne = await buildTicket();

  const userOne = global.signin();
  // Create one order as User #1
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userOne)
    .expect(200);

  // Make sure we only got the orders for User #2
  expect(response.body.id).toEqual(order.id);
});


it("fetches orders for an another user therefore unauthorised", async () => {
  // Create three tickets
  const ticketOne = await buildTicket();

  const userOne = global.signin();
  const usertwo = global.signin();

  // Create one order as User #1
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", usertwo)
    .expect(401);
});