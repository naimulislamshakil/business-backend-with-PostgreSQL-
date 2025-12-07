import pool from '../config/db.js';

export const addCategoryModule = async (name, isActive, description, slug) => {
	const result = await pool.query(
		'INSERT INTO categories(name, is_active, description, slug) VALUES($1,$2,$3,$4) RETURNING *',
		[name, isActive, description, slug]
	);
	return result.rows[0];
};
