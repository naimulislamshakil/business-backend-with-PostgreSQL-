import express from 'express';
import {
	addToCart,
	decreaseCart,
	deleteCart,
	getAllCartProduct,
	increaseCart,
} from '../controllers/cartControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post(
	'/add',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	addToCart
);
router.get(
	'/',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	getAllCartProduct
);
router.put(
	'/increase',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	increaseCart
);
router.put(
	'/decrease',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	decreaseCart
);
router.delete(
	'/',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	deleteCart
);

export default router;
