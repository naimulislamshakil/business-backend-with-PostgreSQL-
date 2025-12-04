import pool from '../config/db.js';

export const isUserAlreadyExisting = async (email) => {
	const result = await pool.query(
		'SELECT * FROM users WHERE email = $1 AND account_verified=true LIMIT 1',
		[email]
	);

	return result.rows[0];
};

export const createUser = async (name, email, password, phone) => {
	const result = await pool.query(
		'INSERT INTO users(name,email,password,phone) VALUES($1,$2,$3,$4) RETURNING *',
		[name, email, password, phone]
	);

	return result.rows[0];
};
