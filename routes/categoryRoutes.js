import express from 'express';
import {
	addCategory,
	deleteCategory,
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
router.delete(
	'/category/:id',
	isAuthenticated,
	authorizeRoles('admin'),
	deleteCategory
);

export default router;
