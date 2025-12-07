import express from 'express';
import {
	addCategory,
	getAllCategories,
} from '../controllers/categoryControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.post(
	'/addCategory',
	isAuthenticated,
	authorizeRoles('admin'),
	addCategory
);
router.get(
	'/category',
	isAuthenticated,
	authorizeRoles('admin'),
	getAllCategories
);

export default router;
