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

router.post('/add', isAuthenticated, authorizeRoles('user'), addToCart);
router.get('/', isAuthenticated, authorizeRoles('user'), getAllCartProduct);
router.put('/increase', isAuthenticated, authorizeRoles('user'), increaseCart);
router.put('/decrease', isAuthenticated, authorizeRoles('user'), decreaseCart);
router.delete('/', isAuthenticated, authorizeRoles('user'), deleteCart);

export default router;
