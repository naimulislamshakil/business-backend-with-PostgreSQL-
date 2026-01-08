import pool from '../config/db.js';

export const addContactMessageModel = async (
	fullName,
	email,
	orderNumber,
	subject,
	message
) => {
	const result = await pool.query(
		`
        INSERT INTO contacts(
        full_name,
	    email,
	    order_number,
	    subject,
	    message) VALUES($1, $2, $3, $4, $5)
        RETURNING *
        `,
		[fullName, email, orderNumber, subject, message]
	);

	return result.rows[0];
};
