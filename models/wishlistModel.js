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

export const getAllWishlistByUserModel = async (userId) => {
	const result = await pool.query(
		`
        SELECT
        w.*,
        p.name AS product_name,
        p.slug AS product_slug,
        c.name AS product_category,
        p.price AS product_price,
        p.is_active AS product_is_active,
        p.images[1] AS product_image
        FROM wishlists w
        JOIN products p ON p.product_id =  w.product_id
        JOIN categories c ON c.category_id = p.category_id
        WHERE w.user_id = $1 
        ORDER BY w.created_at DESC
        `,
		[userId]
	);

	return result.rows;
};
