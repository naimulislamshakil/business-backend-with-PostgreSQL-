import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
	addWishlist,
	getAllWishlistByUser,
} from '../controllers/wishlistControllers.js';

const router = express.Router();

router.post(
	'/:productId',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	addWishlist
);

router.get(
	'/',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	getAllWishlistByUser
);

export default router;
