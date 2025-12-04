import express from 'express';
import { registerControllers } from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', registerControllers);

export default router;
