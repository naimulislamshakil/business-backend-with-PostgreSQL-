import { catchAsyncError } from '../middlewares/catchAsyncError.js';
import ErrorHandler from '../middlewares/errorHandler.js';
import { handelResponse } from '../middlewares/handelResponse.js';
import { addCategoryModule } from '../models/categoryModal.js';

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
