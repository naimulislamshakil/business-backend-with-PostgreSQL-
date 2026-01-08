import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import { addContactMessageModel } from '../models/contactModels.js';

export const addContactMessage = catchAsyncError(async (req, res, next) => {
	const { fullName, email, orderNumber, subject, message } = req.body;

	const result = await addContactMessageModel(
		fullName,
		email,
		orderNumber,
		subject,
		message
	);

	if (result) {
		handelResponse(res, 200, true, 'Your message successfully submitted.');
	}
});
