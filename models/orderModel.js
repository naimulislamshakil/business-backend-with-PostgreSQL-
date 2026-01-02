import pool from '../config/db.js';

export const createOrderModel = async ({
	order_number,
	user_id,
	subtotal,
	shipping_cost,
	tax,
	total_amount,
	payment_method,
	shipping_first_name,
	shipping_last_name,
	shipping_phone,
	shipping_address,
	shipping_city,
	shipping_postal_code,
	shipping_country,
}) => {
	const result = await pool.query(
		`
        INSERT INTO orders (
            order_number,
            user_id,
            subtotal,
            shipping_cost,
            tax,
            total_amount,
            payment_method,
            shipping_first_name,
            shipping_last_name,
            shipping_phone,
            shipping_address,
            shipping_city,
            shipping_postal_code,
            shipping_country
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
        RETURNING *
        `,
		[
			order_number,
			user_id,
			subtotal,
			shipping_cost,
			tax,
			total_amount,
			payment_method,
			shipping_first_name,
			shipping_last_name,
			shipping_phone,
			shipping_address,
			shipping_city,
			shipping_postal_code,
			shipping_country,
		]
	);

	return result.rows[0];
};

export const addProductIntoOrderItems = async (
	order_id,
	product_id,
	color,
	quantity,
	price
) => {
	const result = await pool.query(
		`
        INSERT INTO order_items (
        order_id,
	    product_id,
	    color,
	    quantity,
	    price
        )
        VALUES($1,$2,$3,$4,$5)
        `,
		[order_id, product_id, color, quantity, price]
	);
};

export const getSingleOrderModel = async (orderId) => {
	const result = await pool.query(
		`
        SELECT * FROM orders WHERE id = $1
        `,
		[orderId]
	);

	return result.rows[0];
};
