import express from 'express';
import {
	registerControllers,
	verifyOtp,
} from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', registerControllers);
router.post('/verifyEmail', verifyOtp);

export default router;
