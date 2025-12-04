import pool from '../config/db.js';
import { catchAsyncError } from './catchAsyncError.js';
import ErrorHandler from './errorHandler.js';
import jwt from 'jsonwebtoken';

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
	const { token } = req.cookies;

	if (!token) {
		return next(new ErrorHandler('User is not authenticated.', 400));
	}

	const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN_KEY);

	req.user = (
		await pool.query('SELECT * FROM users WHERE id=$1', [decoded.id])
	).rows[0];

	next();
});
