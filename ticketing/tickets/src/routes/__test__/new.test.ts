import request from "supertest";
import { app } from "../../app";
import { Ticket } from '../../models/ticket';


it("route listening to /api/tickets for post", async () => {
  const response = await request(app)
  .post('/api/tickets')
  .send({})
  expect(response.status).not.toEqual(404)
});
it("Can be accessed only if signed in", async () => {
  await request(app)
  .post('/api/tickets')
  .send({})
  .expect(401)
});
it("Returns true if user is signed in", async () => {
  const response = await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({})
  
  expect(response.status).not.toEqual(401)
});
it("Returns an error for invalid title", async() => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: '',
    price: 10
  })
  .expect(400)

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    price: 10
  })
  .expect(400)
});
it("Returns an error for invalid price", async() => {
  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'abcdef',
    price: -10
  })
  .expect(400)

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title: 'abcdef',
  })
  .expect(400)
});
it("Creates a ticket", async() => {
  let tickets = await Ticket.find({})
  expect(tickets.length).toEqual(0);

  let title = 'abcdef'

  await request(app)
  .post('/api/tickets')
  .set('Cookie', global.signin())
  .send({
    title,
    price: 20,
  })
  .expect(201)
  tickets = await Ticket.find({})
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(20);
  expect(tickets[0].title).toEqual('abcdef');

});
