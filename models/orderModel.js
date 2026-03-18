import pool from '../config/db.js';

export const createOrderModel = async ({
	order_number,
	user_id,
	subtotal,
	shipping_cost,
	tax = 0,
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
			0,
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
	price,
	name,
	sku,
	image
) => {
	const result = await pool.query(
		`
        INSERT INTO order_items (
        order_id,
	    product_id,
	    color,
	    quantity,
	    price,name,sku,image
        )
        VALUES($1,$2,$3,$4,$5,$6,$7,$8)
        `,
		[order_id, product_id, color, quantity, price, name, sku, image]
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
	payment_method,
	tran_id,
}) => {
	const result = await pool.query(
		`
		UPDATE orders
		SET
			payment_status = 'pending',
			payment_method = $1,
			tran_id = $2,
			paid_at = NOW(),
			updated_at = NOW()
		WHERE id = $3
		AND payment_status <> 'paid'
		RETURNING *
		`,
		[payment_method, tran_id, orderId]
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
		SELECT * FROM orders WHERE order_number = $1
		`,
		[orderId]
	);

	return result.rows[0];
};

export const getAllOrderByUserModel = async (userId) => {
	const result = await pool.query(
		`
		SELECT * FROM orders WHERE user_id = $1 ORDER BY paid_at DESC
		`,
		[userId]
	);

	return result.rows;
};

export const getAllOrderItemModel = async (orderId) => {
	const result = await pool.query(
		`
		SELECT * FROM order_items WHERE order_id=$1
		`,
		[orderId]
	);

	return result.rows;
};

export const getOrderByOrderNumberModal = async (orderNumber) => {
	const result = await pool.query(
		`
		SELECT * FROM orders WHERE order_number = $1
		`,
		[orderNumber]
	);

	return result.rows[0];
};

// for admin
export const getAllOrderForAdminModal = async () => {
	const result = await pool.query(
		`
		SELECT o.*,
		u.name AS user_name,
		u.email AS user_email
		FROM orders o
		JOIN users u ON o.user_id = u.user_id
		ORDER BY o.paid_at DESC
		`
	);
	return result.rows;
};

export const updateOrderStatusModal = async (orderId, status) => {
	if (status === 'delivered') {
		const result = await pool.query(
			`
		UPDATE orders
		SET
			status = $1,
			payment_status = 'paid'
		WHERE id = $2
		RETURNING *
		`,
			[status, orderId]
		);
		return result.rows[0];
	} else {
		const result = await pool.query(
			`
		UPDATE orders
		SET
			status = $1
		WHERE id = $2
		RETURNING *
		`,
			[status, orderId]
		);
		return result.rows[0];
	}
};

export const FilterOrdersModel = async (from, to) => {
	const query = `
    WITH daily_data AS (
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total_orders,
        SUM(total_amount) as total_sales
      FROM orders
      WHERE created_at >= $1
      AND created_at < $2::date + INTERVAL '1 day'
      GROUP BY DATE(created_at)
    )
    SELECT 
      json_agg(daily_data ORDER BY date) as chart,
      SUM(total_orders) as total_orders,
      SUM(total_sales) as total_sales,
      CASE 
        WHEN SUM(total_orders) > 0 
        THEN SUM(total_sales) / SUM(total_orders)
        ELSE 0 
      END as avg_order_value
    FROM daily_data;
  `;

	const result = await pool.query(query, [from, to]);
	const data = result.rows[0];

	return {
		chart: (data.chart || []).map((item) => ({
			date: item.date,
			total_orders: Number(item.total_orders),
			total_sales: Number(item.total_sales),
		})),
		summary: {
			totalOrders: Number(data.total_orders || 0),
			totalSales: Number(data.total_sales || 0),
			avgOrderValue: Number(data.avg_order_value || 0),
		},
	};
};

export const pieOrdersModel = async (from, to) => {
	const result = await pool.query(
		`SELECT status, COUNT(*) AS total_orders
   FROM orders
   WHERE created_at >= $1
     AND created_at < $2
   GROUP BY status`,
		[from, to]
	);

	const chartData = result.rows.map((item) => ({
		browser: item.status,
		visitors: Number(item.total_orders),
		fill: `var(--color-${item.status})`,
	}));

	return chartData;
};

export const userCardOrderModel = async (userId) => {
	const result = await pool.query(
		`SELECT
    COUNT(*) AS lifetime_orders,
    COALESCE(SUM(total_amount), 0) AS total_spend,
    COALESCE(AVG(total_amount), 0) AS avg_order_value,
    MAX(created_at) AS last_order_date
   FROM orders
   WHERE user_id = $1`,
		[userId]
	);

	return result.rows[0];
};
