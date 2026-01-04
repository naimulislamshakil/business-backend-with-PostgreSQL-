import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { AddOrEditReview } from '../controllers/reviewControllers.js';

const router = express.Router();

router.post(
	'/add_edit',
	isAuthenticated,
	authorizeRoles('user'),
	AddOrEditReview
);

export default router;
