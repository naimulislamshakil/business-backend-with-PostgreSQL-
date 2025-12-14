import pool from '../config/db.js';

export const addProductModel = async (
	name,
	slug,
	description,
	category_id,
	brand,
	sku,
	price,
	stock_quantity,
	weight,
	dimensions,
	images,
	is_active,
	colors
) => {
	const result = await pool.query(
		'INSERT INTO products(name,slug,description,category_id,brand,sku,price,stock_quantity,	weight,	dimensions,	images,	is_active,	colors) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING *',
		[
			name,
			slug,
			description,
			category_id,
			brand,
			sku,
			price,
			stock_quantity,
			weight,
			dimensions,
			images,
			is_active,
			colors,
		]
	);

	return result.rows[0];
};
