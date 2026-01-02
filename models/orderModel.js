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
	shipping_email,
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
            shipping_email,
            shipping_address,
            shipping_city,
            shipping_postal_code,
            shipping_country
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
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
			shipping_email,
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

export const updateOrderTransactionId = async (orderId, tranId) => {
	const result = await pool.query(
		`
		UPDATE orders
		SET tran_id = $1
		WHERE id = $2
		`,
		[tranId, orderId]
	);
};

export const getOrderByTransactionId = async (tranId) => {
	const result = await pool.query(
		`
		SELECT * FROM orders WHERE tran_id = $1
		`,
		[tranId]
	);

	return result.rows[0];
};

export const updateOrderPaymentStatus = async ({
	orderId,
	payment_status,
	payment_method,
	bank_tran_id,
}) => {
	const result = await pool.query(
		`
		UPDATE orders
		SET
			payment_status = 'paid',
			payment_method = $1,
			tran_id = $2,
			paid_at = NOW(),
			updated_at = NOW()
		WHERE id = $3
		AND payment_status <> 'paid'
		RETURNING *
		`,
		[payment_method, bank_tran_id, orderId]
	);
};

export const getOrderItemsByOrderId = async (orderId) => {
	const result = await pool.query(
		`
		SELECT * FROM order_items WHERE order_id = $1
		`,
		[orderId]
	);

	return result.rows;
};

export const getOrderByIdModel = async (orderId) => {
	const result = await pool.query(
		`
		SELECT * FROM orders WHERE id = $1
		`,
		[orderId]
	);

	console.log(result);

	return result.rows[0];
};
