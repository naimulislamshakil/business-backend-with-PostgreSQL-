import express from 'express';
import { addProduct } from '../controllers/productsControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';

const route = express.Router();

route.post('/addproduct', isAuthenticated, authorizeRoles('admin'), addProduct);

export default route;
