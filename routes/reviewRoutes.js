import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
	AddOrEditReview,
	changeReviewApproved,
	deleteReview,
	getAllReviewForAdmin,
	getAllReviewsByUser,
	getReviewByProductId,
} from '../controllers/reviewControllers.js';

const router = express.Router();

router.post(
	'/add_edit',
	isAuthenticated,
	authorizeRoles('user'),
	AddOrEditReview
);
router.get('/', isAuthenticated, authorizeRoles('user'), getAllReviewsByUser);
router.get('/get_review_by_product_id/:productId', getReviewByProductId);
router.delete(
	'/:reviewId',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	deleteReview
);

// for admin
router.get(
	'/get_for_admin',
	isAuthenticated,
	authorizeRoles('admin'),
	getAllReviewForAdmin
);
router.put(
	`/change_Review_approved/:reviewId`,
	isAuthenticated,
	authorizeRoles('admin'),
	changeReviewApproved
);

export default router;
