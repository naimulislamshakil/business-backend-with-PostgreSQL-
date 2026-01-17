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

export const getAllProductsModel = async (filters) => {
	const result = await pool.query(`
    SELECT 
      p.product_id,
      p.name,
      p.slug,
      p.description,
      p.category_id,
      c.name AS category_name,
      p.brand,
      p.sku,
      p.price,
      p.stock_quantity,
      p.weight,
      p.dimensions,
      p.images,
      p.is_active,
      p.colors,
      p.created_at,
      p.updated_at
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
    ORDER BY p.product_id DESC
  `);

	return result.rows;
};

export const deleteProductModel = async (id) => {
	const result = await pool.query(
		'DELETE FROM products WHERE product_id=$1 RETURNING *',
		[id]
	);
	return result.rows[0];
};

export const getSingleProductModel = async (id) => {
	const result = await pool.query(
		'SELECT * FROM products WHERE product_id=$1',
		[id]
	);
	return result.rows[0];
};

export const decreaseProductStock = async (productId, quantity) => {
	const result = await pool.query(
		`
		UPDATE products
		SET stock_quantity = stock_quantity - $1,
		    updated_at = NOW()
		WHERE product_id = $2
		AND stock_quantity >= $1
		RETURNING *;
		`,
		[quantity, productId]
	);
};

export const getProductByCategoryModel = async (categoryId) => {
	const result = await pool.query(
		`
		 SELECT 
      p.product_id,
      p.name,
      p.slug,
      p.description,
      p.category_id,
      c.name AS category_name,
      p.brand,
      p.sku,
      p.price,
      p.stock_quantity,
      p.weight,
      p.dimensions,
      p.images,
      p.is_active,
      p.colors,
      p.created_at,
      p.updated_at
    FROM products p
    JOIN categories c ON p.category_id = c.category_id
	WHERE p.category_id = $1
    ORDER BY p.product_id DESC
		`,
		[categoryId]
	);
	return result.rows;
};
