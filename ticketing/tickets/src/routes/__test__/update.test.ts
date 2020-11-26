import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

const createTicket = () => {
	return request(app).post(`/api/tickets`).set("Cookie", global.signin()).send({
		title: "first",
		price: 20,
	});
};

it("Returns a 404 if id not found", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.set("Cookie", global.signin())
		.send({
			title: "Hello",
			price: 20,
		})
		.expect(404);
});
it("Returns a 401 if not auth", async () => {
	const id = new mongoose.Types.ObjectId().toHexString();
	await request(app)
		.put(`/api/tickets/${id}`)
		.send({
			title: "Hello",
			price: 20,
		})
		.expect(401);
});
it("Returns a 401 if user doesnt own ticket", async () => {
	const response = await request(app)
		.post(`/api/tickets`)
		.set("Cookie", global.signin())
		.send({
			title: "first",
			price: 20,
		});
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", global.signin())
		.send({
			title: "Hello",
			price: 20,
		})
		.expect(401);
});
it("Returns a 400 if title or price is invalid", async () => {
	const cookie = global.signin();
	const response = await request(app)
		.post(`/api/tickets`)
		.set("Cookie", cookie)
		.send({
			title: "first",
			price: 20,
		});
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "",
			price: 20,
		})
		.expect(400);
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "asdad",
			price: -20,
		})
		.expect(400);
});
it("Returns a 200 if updated", async () => {
  const cookie = global.signin();
	const response = await request(app)
		.post(`/api/tickets`)
		.set("Cookie", cookie)
		.send({
			title: "first",
			price: 20,
		});
	await request(app)
		.put(`/api/tickets/${response.body.id}`)
		.set("Cookie", cookie)
		.send({
			title: "update",
			price: 20.5,
		})
    .expect(200);
    
    const ticketUpdated = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

    expect(ticketUpdated.body.title).toEqual('update')
    expect(ticketUpdated.body.price).toEqual(20.5)
});
