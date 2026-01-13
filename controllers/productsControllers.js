import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import { getCategoryByIdModel } from '../models/categoryModal.js';
import {
	addProductModel,
	deleteProductModel,
	getAllProductsModel,
	getProductByCategoryModel,
	getSingleProductModel,
} from '../models/productsModel.js';
import { generateSKU } from '../utils/generate-sku.js';

export const addProduct = catchAsyncError(async (req, res, next) => {
	const {
		name,
		description,
		category_id,
		brand,
		price,
		stock_quantity,
		weight,
		dimensions,
		is_active,
		colors,
		images,
	} = req.body;

	const requiredFields = [
		name,
		description,
		category_id,
		brand,
		price,
		stock_quantity,
		weight,
		dimensions,
		colors,
		images,
		is_active,
	];

	if (
		requiredFields.some(
			(field) => field === undefined || field === null || field === ''
		)
	) {
		return next(new ErrorHandler('All fields are required.', 400));
	}

	const slug = name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	const category = await getCategoryByIdModel(category_id);

	const sku = generateSKU(category.name);
	const result = await addProductModel(
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
	);

	if (result) {
		handelResponse(res, 200, true, 'Products create successfully');
	}
});

export const getAllProducts = catchAsyncError(async (req, res, next) => {
	const result = await getAllProductsModel();

	if (result) {
		handelResponse(res, 200, true, 'Get all products.', result);
	}
});

export const deleteProduct = catchAsyncError(async (req, res, next) => {
	const { id } = req.params;
	const result = await deleteProductModel(id);
	if (result) {
		handelResponse(res, 200, true, 'Product delete successfully.');
	}
});

export const getSingleProduct = catchAsyncError(async (req, res, next) => {
	const { id } = req.params;
	const result = await getSingleProductModel(id);
	if (result) {
		handelResponse(res, 200, true, 'Product get successfully.', result);
	}
});

export const getProductByCategory = catchAsyncError(async (req, res, next) => {
	const { categoryId } = req.params;

	console.log(categoryId);

	const result = await getProductByCategoryModel(categoryId);

	if (result) {
		handelResponse(res, 200, true, 'Get all product by category', result);
	}
});
