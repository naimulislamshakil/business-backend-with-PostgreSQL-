import pool from '../config/db.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import { addCartItemModel, getAllCartModel } from '../models/cartModel.js';

export const addToCart = catchAsyncError(async (req, res, next) => {
	try {
		const { user_id } = req.user;
		const { product_id, color, quantity = 1 } = req.body;

		const addCartItem = await addCartItemModel({
			product_id,
			color,
			quantity,
			user_id,
		});

		if (addCartItem) {
			handelResponse(res, 200, true, 'Product successfully add to cart');
		}
	} catch (error) {
		return next(new ErrorHandler('Product not added in cart.'));
	}
});

export const getAllCartProduct = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;

	const result = await getAllCartModel(user_id);

	if (result) {
		handelResponse(res, 200, true, 'Get all cart product', result);
	}
});
