import express from 'express';
import {
	createPayment,
	getAllOrderByUser,
	getAllOrderItem,
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
router.get(
	'/get_order_by_user',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	getAllOrderByUser
);
router.get(
	'/get_order_item/:order_id',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	getAllOrderItem
);
router.post('/payment_success', paymentSuccess);

export default router;
