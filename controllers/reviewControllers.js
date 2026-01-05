import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import {
	addReviewModel,
	deleteReviewModel,
	editReviewModel,
	findExzistingReviewModel,
	getAllReviewByUserMOdel,
	getAllReviewCountModel,
} from '../models/reviewModel.js';

export const AddOrEditReview = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { product_id, rating, title, comment } = req.body;

	const review = await findExzistingReviewModel(user_id, product_id);

	if (review) {
		const id = review.id;
		const result = await editReviewModel(user_id, rating, title, comment, id);

		if (result) {
			return handelResponse(res, 200, true, 'Review edit successfully');
		}
	}

	if (!review) {
		const result = await addReviewModel(
			user_id,
			product_id,
			rating,
			title,
			comment
		);

		if (result) {
			return handelResponse(res, 200, true, 'Review add successfully');
		}
	}
});

export const getAllReviewsByUser = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const page = Number(req.query.page) || 1;
	const limit = 5;

	const offset = (page - 1) * limit;

	const reviews = await getAllReviewByUserMOdel(limit, offset, user_id);

	const reviewCount = await getAllReviewCountModel(user_id);
	const data = {
		data: reviews,
		totoal: reviewCount,
		totalPage: Math.ceil(reviewCount / limit),
	};

	if (reviews && reviewCount) {
		handelResponse(res, 200, true, 'Get all review by user', data);
	}
});

export const deleteReview = catchAsyncError(async (req, res, next) => {
	const { user_id } = req.user;
	const { reviewId } = req.params;

	const result = await deleteReviewModel(reviewId, user_id);

	if (result) {
		handelResponse(res, 200, true, 'Review delete successfully.');
	}
});
