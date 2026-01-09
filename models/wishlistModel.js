import pool from '../config/db.js';

export const addWishlistModel = async (userId, productId) => {
	const result = await pool.query(
		`
        INSERT INTO wishlists(user_id,product_id) VALUES($1,$2) RETURNING *
        `,
		[userId, productId]
	);
	return result.rows[0];
};

export const isProductAddedInWishlist = async (userId, productId) => {
	const result = await pool.query(
		`
        SELECT * FROM wishlists WHERE user_id = $1 AND product_id = $2
        `,
		[userId, productId]
	);
	return result.rows[0];
};
