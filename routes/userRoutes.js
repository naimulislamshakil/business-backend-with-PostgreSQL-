import express from 'express';
import {
	login,
	me,
	registerControllers,
	verifyOtp,
} from '../controllers/userControllers.js';
import { isAuthenticated } from '../middlewares/auth.js';

const router = express.Router();

router.post('/register', registerControllers);
router.post('/verifyEmail', verifyOtp);
router.post('/login', login);
router.get('/me', isAuthenticated, me);

export default router;
