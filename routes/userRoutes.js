import express from 'express';
import {
	login,
	logout,
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
router.post('/logout', isAuthenticated, logout);

export default router;
