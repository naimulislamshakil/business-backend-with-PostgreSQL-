import pool from '../config/db.js';

export const addCategoryModule = async (name, isActive, description, slug) => {
	const result = await pool.query(
		'INSERT INTO categories(name, is_active, description, slug) VALUES($1,$2,$3,$4) RETURNING *',
		[name, isActive, description, slug]
	);
	return result.rows[0];
};

export const getAllcategoriesModel = async () => {
	const result = await pool.query('SELECT * FROM categories');
	return result.rows;
};

export const deleteCategoryModel = async (id) => {
	const result = await pool.query(
		'DELETE FROM categories WHERE category_id=$1 RETURNING *',
		[id]
	);
	return result.rows[0];
};

export const updateCategoryModel = async (
	name,
	description,
	isActive,
	newSlug,
	id
) => {
	const result = await pool.query(
		'UPDATE categories SET name=$1, description=$2, is_active=$3, slug=$4 WHERE category_id=$5 RETURNING *',
		[name, description, isActive, newSlug, id]
	);

	return result.rows[0];
};

export const getCategoryByIdModel = async (id) => {
	const result = await pool.query(
		'SELECT * FROM categories WHERE category_id = $1',
		[id]
	);

	return result.rows[0];
};
