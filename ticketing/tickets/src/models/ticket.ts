import mongoose from "mongoose";

//Interface for describing properties on new Ticket

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

//Interface describing Ticket model properties

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
}

//Interface describing Ticket document

interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
}

const ticketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
  },
  userId: {
    
  }
}, {
	toJSON: {
		transform(doc, ret) {
			ret.id = ret._id
			delete ret._id
		}
	}
});


ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc , TicketModel>("Ticket", ticketSchema);

export { Ticket };
