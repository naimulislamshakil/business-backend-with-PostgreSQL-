import express from 'express';
import { isAuthenticated } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/roleMiddleware.js';
import { addContactMessage } from '../controllers/contactControllers.js';

const router = express.Router();

router.post('/', isAuthenticated, authorizeRoles('user'), addContactMessage);

export default router;
