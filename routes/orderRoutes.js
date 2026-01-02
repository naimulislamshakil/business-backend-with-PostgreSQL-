import express from 'express';
import {
	createPayment,
	getOrderById,
	makeOrder,
	paymentSuccess,
} from '../controllers/orderControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post(
	'/create_order',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	makeOrder
);

router.post(
	'/create_payment/:order_id',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	createPayment
);
router.get(
	'/get_order/:order_id',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	getOrderById
);
router.post('/payment_success', paymentSuccess);

export default router;
