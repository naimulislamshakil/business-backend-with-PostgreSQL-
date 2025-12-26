import express from 'express';
import { makeOrder } from '../controllers/orderControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post('/makeorder', isAuthenticated, authorizeRoles('admin'), makeOrder);

export default router;
