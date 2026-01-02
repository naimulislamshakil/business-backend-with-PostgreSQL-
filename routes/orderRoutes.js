import express from 'express';
import {
	createPayment,
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
router.post('/payment_success', paymentSuccess);

export default router;
