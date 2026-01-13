import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import {
	addWishlistModel,
	getAllWishlistByUserModel,
	isProductAddedInWishlist,
} from '../models/wishlistModel.js';

export const addWishlist = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { productId } = req.params;

	const wishlist = await isProductAddedInWishlist(user_id, productId);

	if (wishlist) {
		handelResponse(res, 200, true, 'Already added this product.');
	}

	const result = await addWishlistModel(user_id, productId);

	if (result) {
		handelResponse(res, 200, true, 'Product added successfully.');
	}
});

export const getAllWishlistByUser = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;

	const result = await getAllWishlistByUserModel(user_id);

	if (result) {
		handelResponse(res, 200, true, 'Get all wishlist.', result);
	}
});
