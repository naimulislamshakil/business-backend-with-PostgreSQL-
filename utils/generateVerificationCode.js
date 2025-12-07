import pool from '../config/db.js';

export const generateVerificationCode = async (id) => {
	const firstDigit = Math.floor(Math.random() * 9) + 1;
	const remainingDigits = Math.floor(Math.random() * 100000)
		.toString()
		.padStart(5, 0);

	const desigt = parseInt(firstDigit + remainingDigits);
	const expireTime = new Date(Date.now() + 10 * 60 * 1000);

	await pool.query(
		'UPDATE users SET verificition_code=$1,verificition_code_expire=$2 WHERE user_id=$3',
		[desigt, expireTime, id]
	);

	return desigt;
};
