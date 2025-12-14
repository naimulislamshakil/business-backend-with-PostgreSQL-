import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import {
	addCategoryModule,
	deleteCategoryModel,
	getAllcategoriesModel,
	getCategoryByIdModel,
	updateCategoryModel,
} from '../models/categoryModal.js';

export const addCategory = catchAsyncError(async (req, res, next) => {
	try {
		const { name, isActive, description } = req.body;

		if (!name || !isActive || !description) {
			return next(new ErrorHandler('All field are required.', 400));
		}

		const slug = name
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '');

		const result = await addCategoryModule(name, isActive, description, slug);

		if (result) {
			handelResponse(res, 200, true, 'Category create successfully.');
		}
	} catch (error) {
		next(error.message);
	}
});

export const getAllCategories = catchAsyncError(async (req, res, next) => {
	const categories = await getAllcategoriesModel();
	res.status(200).json({
		success: true,
		message: 'Category Get',
		data: categories,
	});
});

export const deleteCategory = catchAsyncError(async (req, res, next) => {
	const { id } = req.params;
	const result = await deleteCategoryModel(id);
	if (result) {
		handelResponse(res, 200, true, 'Category delete successfully.');
	}
});

export const updateCategory = catchAsyncError(async (req, res, next) => {
	const categoryId = Number(req.params.id);
	const { name, description, isActive } = req.body;

	console.log({ name, description, isActive });

	if (!name || !description || typeof isActive !== 'boolean') {
		return next(new ErrorHandler('All fields are required.', 400));
	}

	const existing = await getCategoryByIdModel(categoryId);

	if (!existing) {
		return next(new ErrorHandler('Category not found.', 404));
	}

	const newSlug = name
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

	const result = await updateCategoryModel(
		name,
		description,
		isActive,
		newSlug,
		categoryId
	);

	if (!result) {
		return next(new ErrorHandler('Category not found.', 404));
	}

	handelResponse(res, 200, true, 'Category update successfully.');
});

export const getSingleCategory = catchAsyncError(async (req, res, next) => {
	const categoryId = Number(req.params.id);

	const result = await getCategoryByIdModel(categoryId);

	if (result) {
		res.status(200).json({
			success: true,
			message: 'Category Get single',
			data: result,
		});
	}
});
