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
