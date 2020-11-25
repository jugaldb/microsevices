import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
	statusCode = 401;
	constructor() {
		super('Missing Current User');

		Object.setPrototypeOf(this, NotAuthorizedError.prototype);
	}
	serializeErrors() {
		return [{
      message: 'Not authorized!'
    }]
	}
}
