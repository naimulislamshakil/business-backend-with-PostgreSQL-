import pool from '../config/db.js';

export const findExzistingReviewModel = async (userId, productId) => {
	const result = await pool.query(
		`
        SELECT * FROM reviews WHERE user_id = $1 AND product_id = $2
        `,
		[userId, productId]
	);

	return result.rows[0];
};

export const editReviewModel = async (
	userId,
	rating,
	title,
	comment,
	reviewId
) => {
	const result = await pool.query(
		`
    UPDATE reviews
    SET
      rating = $1,
      title = $2,
      comment = $3,
      is_approved = $4,
      is_active = $5,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $6
      AND user_id = $7
    RETURNING *;
    `,
		[rating, title, comment, true, true, reviewId, userId]
	);

	return result.rows[0];
};

export const addReviewModel = async (
	userId,
	productId,
	rating,
	title,
	comment
) => {
	const result = await pool.query(
		`
        INSERT INTO reviews (user_id,product_id,rating,title,comment) VALUES($1,$2, $3, $4, $5) RETURNING *;
        `,
		[userId, productId, rating, title, comment]
	);

	return result.rows[0];
};

export const getAllReviewByUserMOdel = async (limit, offset, userId) => {
	const result = await pool.query(
		`
		SELECT
		r.*,
		p.name AS product_name,
		p.images[1] AS product_image
		FROM reviews r
		JOIN products p ON p.product_id = r.product_id
		WHERE r.user_id = $3 ORDER BY r.created_at DESC
		LIMIT $1 OFFSET $2
		`,
		[limit, offset, userId]
	);

	return result.rows;
};

export const getAllReviewCountModel = async (userId) => {
	const result = await pool.query(
		`
		SELECT COUNT(*)
		FROM reviews
		WHERE user_id = $1
		`,
		[userId]
	);
	return Number(result.rows[0].count);
};

export const deleteReviewModel = async (reviewId, userId) => {
	const result = await pool.query(
		`
		DELETE FROM reviews WHERE id = $1 AND user_id = $2
		RETURNING *
		`,
		[reviewId, userId]
	);

	return result.rows[0];
};

export const getReviewByProductIdModel = async (productId) => {
	const result = await pool.query(
		`
		SELECT r.id,
		r.rating,
		r.title,
		r.comment,
		r.is_approved,
		r.is_active,
		r.created_at,
		r.updated_at,
		u.name
		FROM reviews r
		JOIN users u ON u.user_id = r.user_id
		WHERE r.product_id = $1
		ORDER BY r.created_at DESC
		`,
		[productId]
	);

	return result.rows;
};
