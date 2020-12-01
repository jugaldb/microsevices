import { Ticket } from "../ticket";

it("Implements Optimistic concurrency control", async (done) => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 10,
    userId: "asdas",
  });

  await ticket.save();

  const first = await Ticket.findById(ticket.id);
  const second = await Ticket.findById(ticket.id);

  first!.set({ price: 2 });
  second!.set({ price: 100 });

  await first!.save();

  try {
    await second!.save();
  } catch (error) {
    return done();
  }
  throw new Error("Shouldnt reach here");
});

it("increments version number ", async () => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 10,
    userId: "asdas",
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
