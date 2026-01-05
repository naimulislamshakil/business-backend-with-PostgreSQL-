import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
	AddOrEditReview,
	deleteReview,
	getAllReviewsByUser,
} from '../controllers/reviewControllers.js';

const router = express.Router();

router.post(
	'/add_edit',
	isAuthenticated,
	authorizeRoles('user'),
	AddOrEditReview
);
router.get('/', isAuthenticated, authorizeRoles('user'), getAllReviewsByUser);
router.delete(
	'/:reviewId',
	isAuthenticated,
	authorizeRoles('user'),
	deleteReview
);

export default router;
