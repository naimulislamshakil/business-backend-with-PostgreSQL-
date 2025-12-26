import pool from '../config/db.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import { addCartItemModel } from '../models/cartModel.js';

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

		res.status(200).json({
			success: true,
			cartItem: addCartItem,
		});
	} catch (error) {
		return next(new ErrorHandler('Product not added in cart.'));
	}
});
