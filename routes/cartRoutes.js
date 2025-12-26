import express from 'express';
import { addToCart } from '../controllers/cartControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/add', isAuthenticated, authorizeRoles('user'), addToCart);

export default router;
