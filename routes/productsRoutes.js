import express from 'express';
import {
	addProduct,
	deleteProduct,
	getAllProducts,
	getProductByCategory,
	getSingleProduct,
} from '../controllers/productsControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const route = express.Router();

route.post('/addproduct', isAuthenticated, authorizeRoles('admin'), addProduct);
route.get(
	'/get-product',
	isAuthenticated,
	authorizeRoles('admin'),
	getAllProducts
);
route.get('/get-product-for-frontend', getAllProducts);
route.delete(
	'/delete-product/:id',
	isAuthenticated,
	authorizeRoles('admin'),
	deleteProduct
);
route.get(
	'/product/:id',
	isAuthenticated,
	authorizeRoles('admin'),
	getSingleProduct
);
route.get('/product_for_frontend/:categoryId', getProductByCategory);
route.get('/product-for-frontend/:id', getSingleProduct);

export default route;
