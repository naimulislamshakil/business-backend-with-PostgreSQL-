import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import {
	addReviewModel,
	editReviewModel,
	findExzistingReviewModel,
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
