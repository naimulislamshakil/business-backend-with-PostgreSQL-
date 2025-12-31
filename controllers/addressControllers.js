import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import {
	addAddressModel,
	changeIsActiveModel,
	deleteAddressModel,
	getAllAddressModel,
	getSingleAddressModel,
	updateAddressModel,
} from '../models/addressModel.js';

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

export const getAllAddress = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;

	const result = await getAllAddressModel(user_id);

	if (result) {
		handelResponse(res, 200, true, 'Get all address', result);
	}
});

export const changeIsActive = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { id } = req.params;

	const result = await changeIsActiveModel(user_id, id);

	if (result) {
		handelResponse(res, 200, true, 'Address Changed.');
	}
});

export const deleteAddress = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { id } = req.params;

	const result = await deleteAddressModel(id, user_id);

	if (result) {
		handelResponse(res, 200, true, 'Delete address.');
	}
});

export const getSingleAddress = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { id } = req.params;

	const result = await getSingleAddressModel(id, user_id);

	if (result) {
		handelResponse(res, 200, true, 'Get address', result);
	}
});

export const updateAddress = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { id } = req.params;
	const { title, firstName, lastName, address, city, postalCode, country } =
		req.body;

	const result = await updateAddressModel(
		id,
		user_id,
		title,
		firstName,
		lastName,
		address,
		city,
		postalCode,
		country
	);
	if (result) {
		handelResponse(res, 200, true, 'Update sccessfully');
	}
});
