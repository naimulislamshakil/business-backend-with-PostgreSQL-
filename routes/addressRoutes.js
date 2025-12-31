import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import {
	addAddress,
	changeIsActive,
	deleteAddress,
	getAllAddress,
	getSingleAddress,
	updateAddress,
} from '../controllers/addressControllers.js';

const route = express.Router();

route.post('/', isAuthenticated, authorizeRoles('user', 'admin'), addAddress);
route.get('/', isAuthenticated, authorizeRoles('user', 'admin'), getAllAddress);
route.get(
	'/change-is-active/:id',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	changeIsActive
);
route.get(
	'/:id',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	getSingleAddress
);
route.put(
	'/:id',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	updateAddress
);
route.delete(
	'/:id',
	isAuthenticated,
	authorizeRoles('user', 'admin'),
	deleteAddress
);

export default route;
