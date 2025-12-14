export function generateSKU(categoryName) {
	const prefix = categoryName.slice(0, 3).toUpperCase();

	const randomNumber = Math.floor(100000 + Math.random() * 900000);

	return `${prefix}-${randomNumber}`;
}
