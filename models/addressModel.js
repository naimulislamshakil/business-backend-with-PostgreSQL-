import pool from '../config/db.js';

export const addAddressModel = async (
	user_id,
	title,
	firstName,
	lastName,
	address,
	city,
	postalCode,
	country
) => {
	const update = await pool.query(
		`
        UPDATE shipping_addresses
        SET is_active=false
        WHERE user_id=$1 AND is_active=true
        `,
		[user_id]
	);

	const result = await pool.query(
		`INSERT INTO shipping_addresses(
    user_id, title, first_name, last_name, address, city, postal_code, country, is_active) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
    RETURNING *`,
		[
			user_id,
			title,
			firstName,
			lastName,
			address,
			city,
			postalCode,
			country,
			true,
		]
	);

	return result.rows[0];
};
