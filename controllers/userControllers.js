import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import {
	createUser,
	getUserForVerify,
	isUserAlreadyExisting,
} from '../models/userModels.js';
import bcrypt from 'bcrypt';
import { generateVerificationCode } from '../utils/generateVerificationCode.js';
import { sendEmail } from '../utils/sendEmail.js';
import pool from '../config/db.js';
import { sendToken } from '../utils/sendToken.js';

export const registerControllers = catchAsyncError(async (req, res, next) => {
	const { name, email, phone, password } = req.body;
	if (!name || !email || !phone || !password) {
		return next(new ErrorHandler('All fields are required.', 400));
	}

	const existingUser = await isUserAlreadyExisting();

	if (existingUser) {
		return next(new ErrorHandler('User already register. Please Login.', 400));
	}

	const hashPassword = await bcrypt.hash(password, 10);
	const user = await createUser(name, email, hashPassword, phone);

	const varifictionCode = await generateVerificationCode(user.user_id);

	sendVarificationCode(varifictionCode, email, res);
});

async function sendVarificationCode(varificationCode, email, res) {
	try {
		const message = generateEmailTemplate(varificationCode);
		sendEmail({ email, subject: 'Your Verification Code', message });
		handelResponse(
			res,
			200,
			true,
			`Verification email successfully sent to ${email}`
		);
	} catch (error) {
		throw new ErrorHandler('Failed to send verification code.', 500);
	}
}

function generateEmailTemplate(verificationCode) {
	return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
      <h2 style="color: #4CAF50; text-align: center;">Verification Code</h2>
      <p style="font-size: 16px; color: #333;">Dear User,</p>
      <p style="font-size: 16px; color: #333;">Your verification code is:</p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="display: inline-block; font-size: 24px; font-weight: bold; color: #4CAF50; padding: 10px 20px; border: 1px solid #4CAF50; border-radius: 5px; background-color: #e8f5e9;">
          ${verificationCode}
        </span>
      </div>
      <p style="font-size: 16px; color: #333;">Please use this code to verify your email address. The code will expire in 10 minutes.</p>
      <p style="font-size: 16px; color: #333;">If you did not request this, please ignore this email.</p>
      <footer style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
        <p>Thank you,<br>Your Company Team</p>
        <p style="font-size: 12px; color: #aaa;">This is an automated message. Please do not reply to this email.</p>
      </footer>
    </div>
  `;
}

export const verifyOtp = catchAsyncError(async (req, res, next) => {
	const { email, otp } = req.body;
	if (!email || !otp) {
		next(new ErrorHandler('All field is required.'));
	}

	const user = await getUserForVerify(email);

	if (!user) {
		return next(new ErrorHandler('User Not found.', 400));
	}

	if (user.verificition_code !== Number(otp)) {
		return next(new ErrorHandler('Invalid OTP', 400));
	}

	const currentDate = Date.now();

	const verificationCodeExpire = new Date(
		user.verificition_code_expire
	).getTime();

	if (currentDate > verificationCodeExpire) {
		return next(new ErrorHandler('OTP Expire', 400));
	}

	await pool.query(
		'UPDATE users SET account_verified=true,verificition_code=null,verificition_code_expire=null WHERE email=$1',
		[email]
	);

	handelResponse(res, 200, true, 'Account Verified');
});

export const login = catchAsyncError(async (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new ErrorHandler('All field is required.', 400));
	}

	const user = await isUserAlreadyExisting(email);

	if (!user) {
		return next(new ErrorHandler('Invalid email and password', 400));
	}

	const isMatchPassword = await bcrypt.compare(password, user.password);

	if (!isMatchPassword) {
		return next(new ErrorHandler('Invalid email and password', 400));
	}

	sendToken(user, 200, 'User login successfully.', res);
});

export const me = catchAsyncError(async (req, res, next) => {
	const { password, ...userData } = req.user;
	handelResponse(res, 200, true, 'User', userData);
});

export const logout = catchAsyncError(async (req, res, next) => {
	res
		.status(200)
		.cookie('token', '', {
			expires: new Date(Date.now()),
			httpOnly: true,
		})
		.json({
			success: true,
			message: 'Logged out successfully.',
		});
});
