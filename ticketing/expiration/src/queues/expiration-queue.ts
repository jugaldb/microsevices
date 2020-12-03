import Queue from "bull";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order:expiration", {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

console.log("hello friend");

expirationQueue.process(async (job) => {
  try {
    new ExpirationCompletePublisher(natsWrapper.client).publish({
      orderId: job.data.orderId,
    });
  } catch (error) {
    console.log(error)
  }
});

export { expirationQueue };
