import express from 'express';
import { addCategory } from '../controllers/categoryControllers.js';

const router = express.Router();

router.post("/addCategory",addCategory)

export default router;
