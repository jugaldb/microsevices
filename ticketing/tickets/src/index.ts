import mongoose from 'mongoose'
import { app } from './app'

const start = async () => {
	if(!process.env.JWT_KEY){
		throw new Error('JWT_KEY must be defined')
	}
	try {
		await mongoose.connect(process.env.MONGODB_URI!, {
			useUnifiedTopology: true,
			useCreateIndex: true,
			useNewUrlParser: true,
		});
		console.log("Connected to MongoDB");
	} catch (err) {
		console.log(err);
	}

	app.listen(3000, () => {
		console.log("Listening on port 3000!");
	});
};

start();
