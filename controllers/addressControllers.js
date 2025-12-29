import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import { addAddressModel } from '../models/addressModel.js';

export const addAddress = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { title, firstName, lastName, address, city, postalCode, country } =
		req.body;

	const addAddress = await addAddressModel(
		user_id,
		title,
		firstName,
		lastName,
		address,
		city,
		postalCode,
		country
	);

	if (addAddress) {
		handelResponse(res, 200, true, 'Address added successfully');
	}
});
