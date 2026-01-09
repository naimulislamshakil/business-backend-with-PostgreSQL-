import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { addWishlist } from '../controllers/wishlistControllers.js';

const router = express.Router();

router.post(
	'/:productId',
	isAuthenticated,
	authorizeRoles('user'),
	addWishlist
);

export default router;
