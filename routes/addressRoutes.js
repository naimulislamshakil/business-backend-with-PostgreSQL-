import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { addAddress } from '../controllers/addressControllers.js';

const route = express.Router();

route.post('/', isAuthenticated, authorizeRoles('user', 'admin'), addAddress);

export default route;
