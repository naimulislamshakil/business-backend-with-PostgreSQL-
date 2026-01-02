import pool from '../config/db.js';
import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import {
	addCartItemModel,
	deleteCartModel,
	getAllCartModel,
	updateCartQuantityModel,
} from '../models/cartModel.js';
import { getSingleProductModel } from '../models/productsModel.js';

export const addToCart = catchAsyncError(async (req, res, next) => {
	try {
		const { user_id } = req.user;
		const { product_id, color, quantity = 1 } = req.body;

		const product = await getSingleProductModel(product_id);

		const addCartItem = await addCartItemModel({
			product_id,
			color,
			quantity,
			user_id,
			name: product.name,
			sku: product.sku,
			image:product.images[0]
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

export const increaseCart = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { product_id, color } = req.body;
	const updatedItem = await updateCartQuantityModel({
		userId: user_id,
		productId: product_id,
		color,
		type: 'increase',
	});

	if (updatedItem) {
		handelResponse(res, 200, true, 'Product quantity updated', updatedItem);
	} else {
		return next(new ErrorHandler('Product not found in cart', 404));
	}
});

export const decreaseCart = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { product_id, color } = req.body;
	const updatedItem = await updateCartQuantityModel({
		userId: user_id,
		productId: product_id,
		color,
		type: 'decrease',
	});

	if (updatedItem.quantity <= 0) {
		console.log('object');
		const deleteItem = await deleteCartModel({
			userId: user_id,
			productId: product_id,
			color,
		});

		if (deleteItem) {
			return handelResponse(
				res,
				200,
				true,
				'Product removed from cart',
				deleteItem
			);
		}
	}

	if (updatedItem) {
		handelResponse(res, 200, true, 'Product quantity updated', updatedItem);
	} else {
		return next(new ErrorHandler('Product not found in cart', 404));
	}
});

export const deleteCart = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { product_id, color } = req.body;

	const deleteItem = await deleteCartModel({
		userId: user_id,
		productId: product_id,
		color,
	});

	if (deleteItem) {
		handelResponse(res, 200, true, 'Product removed from cart', deleteItem);
	} else {
		return next(new ErrorHandler('Product not found in cart', 404));
	}
});
