import express from 'express';
import {
	login,
	registerControllers,
	verifyOtp,
} from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', registerControllers);
router.post('/verifyEmail', verifyOtp);
router.post('/login', login);

export default router;
