import express from 'express';
import {
	addCategory,
	deleteCategory,
	getAllCategories,
	getSingleCategory,
	updateCategory,
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
router.delete(
	'/category/:id',
	isAuthenticated,
	authorizeRoles('admin'),
	deleteCategory
);
router.put(
	'/category/:id',
	isAuthenticated,
	authorizeRoles('admin'),
	updateCategory
);
router.get(
	'/category/:id',
	isAuthenticated,
	authorizeRoles('admin'),
	getSingleCategory
);

export default router;
