import pool from '../config/db.js';

export const addAddressModel = async (
	user_id,
	title,
	firstName,
	lastName,
	address,
	city,
	postalCode,
	country,
	phone,
	email
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
    user_id, title, first_name, last_name, address, city, postal_code, country, is_active,phone,email) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
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
			phone,
			email,
		]
	);

	return result.rows[0];
};

export const getAllAddressModel = async (userId) => {
	const result = await pool.query(
		`
        SELECT * FROM shipping_addresses WHERE user_id=$1 ORDER BY is_active DESC
        `,
		[userId]
	);

	return result.rows;
};

export const changeIsActiveModel = async (userId, id) => {
	const update = await pool.query(
		`
        UPDATE shipping_addresses
        SET is_active=false
        WHERE user_id=$1 AND is_active=true
        `,
		[userId]
	);

	const result = await pool.query(
		`
		UPDATE shipping_addresses
		SET is_active= true
		WHERE id=$1 AND user_id=$2
		RETURNING *
		`,
		[id, userId]
	);
	return result.rows[0];
};

export const deleteAddressModel = async (id, userId) => {
	const result = await pool.query(
		`
		DELETE FROM shipping_addresses WHERE id=$1 AND user_id=$2 RETURNING *
		`,
		[id, userId]
	);

	return result.rows[0];
};

export const getSingleAddressModel = async (id, userId) => {
	const result = await pool.query(
		`
		SELECT * FROM shipping_addresses WHERE id=$1 AND user_id=$2 
		`,
		[id, userId]
	);

	return result.rows[0];
};

export const updateAddressModel = async (
	id,
	userId,
	title,
	firstName,
	lastName,
	address,
	city,
	postalCode,
	country,
	phone,
	email
) => {
	const result = await pool.query(
		`
		UPDATE shipping_addresses
		SET
		title = $1,
    	first_name = $2,
    	last_name = $3,
    	address = $4,
    	city = $5,
    	postal_code = $6,
    	country = $7
		phone = $10
		email = $11
		WHERE
		id = $8 AND user_id = $9
		RETURNING *
		`,
		[
			title,
			firstName,
			lastName,
			address,
			city,
			postalCode,
			country,
			id,
			userId,
			phone,
			email,
		]
	);

	return result.rows[0];
};
