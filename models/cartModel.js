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
