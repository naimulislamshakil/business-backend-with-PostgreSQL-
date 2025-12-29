import pool from '../config/db.js';

export const addCartItemModel = async ({
	product_id,
	color = null,
	quantity = 1,
	user_id,
}) => {
	await pool.query(
		'INSERT INTO carts (user_id) VALUES ($1) ON CONFLICT (user_id) DO NOTHING',
		[user_id]
	);

	const { rows } = await pool.query('SELECT id FROM carts WHERE user_id = $1', [
		user_id,
	]);
	const cart_id = rows[0].id;

	const insertResult = await pool.query(
		`
    INSERT INTO cart_items (cart_id, product_id, color, quantity, price)
    VALUES ($1, $2, $3, $4, (SELECT price FROM products WHERE product_id = $2))
    ON CONFLICT (cart_id, product_id, color)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
    RETURNING *;
    `,
		[cart_id, product_id, color, quantity]
	);

	return insertResult.rows[0];
};

export const getAllCartModel = async (userId) => {
	const result = await pool.query(
		`SELECT ci.id,
    ci.color,
    ci.quantity,
    ci.price,
	ci.product_id,
    p.name,
    p.images[1] AS image
    FROM cart_items ci
    JOIN  carts c ON ci.cart_id=c.id
    JOIN products p ON ci.product_id=p.product_id
    WHERE c.user_id=$1`,
		[userId]
	);

	return result.rows;
};

export const updateCartQuantityModel = async ({
	userId,
	productId,
	color,
	type,
}) => {
	const { rows } = await pool.query(`SELECT id FROM carts WHERE user_id=$1`, [
		userId,
	]);

	if (!rows.length) return null;

	const cart_id = rows[0].id;

	if (type === 'increase') {
		const { rows: updatedRows } = await pool.query(
			`
			UPDATE cart_items
			SET quantity=quantity+1
			WHERE cart_id=$1 AND product_id=$2 AND color IS NOT DISTINCT FROM $3
			RETURNING *
			`,
			[cart_id, productId, color]
		);

		if (!updatedRows.length) return null;
		return updatedRows[0];
	} else if (type === 'decrease') {
		const { rows: updatedRows } = await pool.query(
			`
			UPDATE cart_items
			SET quantity=quantity-1
			WHERE cart_id=$1 AND product_id=$2 AND color IS NOT DISTINCT FROM $3
			RETURNING *
			`,
			[cart_id, productId, color]
		);
		if (!updatedRows.length) return null;
		return updatedRows[0];
	}
};

export const deleteCartModel = async ({ userId, productId, color }) => {
	const { rows } = await pool.query(`SELECT id FROM carts WHERE user_id=$1`, [
		userId,
	]);

	if (!rows.length) return null;

	const cart_id = rows[0].id;

	const result = await pool.query(
		`
		DELETE FROM cart_items
		WHERE cart_id=$1 AND product_id=$2 AND color IS NOT DISTINCT FROM $3
		RETURNING *
		`,
		[cart_id, productId, color]
	);

	if (!result.rows.length) return null;

	return result.rows[0];
};
