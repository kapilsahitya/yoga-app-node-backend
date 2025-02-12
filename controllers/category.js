const { mongoose } = require("mongoose");
const yogaworkoutCategory = require('../models/category');

const getAllCategories = async (req, res) => {
	try {
		let categories = await yogaworkoutCategory.find();
		if (categories.length === 0) {
			return res.status(400).json({
				message: 'No Categories Added!',
			});
		} else {
			res.status(200).json({
				categories,
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

/**
 * @api {post} /addcategory
 * @apiName addCategory
 * @apiGroup Category
 * @apiParam {String} categoryName Category Name
 * @apiParam {String} [description] Category Description
 * @apiParam {Number} [isActive] Category Status
 * @apiSuccess {Object} Category added successfully!
 * @apiError {Object} Server Error
 * TODO: Add Logic for image upload
 */
const addCategory = async (req, res) => {
	try {
		if (!req.body.categoryName) {
			return res.status(400).json({
				message: 'Enter Categor Name!',
			});
		}

		let categoryName = req.body.categoryName;
		let description = req.body?.description;
		let isActive = req.body.isActive ? req.body.isActive : 1;

		const newCategory = new yogaworkoutCategory({
			category: categoryName,
			description: description,
			isActive: isActive,
		});
		await newCategory.save();
		res.status(201).json({ message: 'Category Added successfully!' });
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

/**
 * @api {post} /updatecategory/:id
 * @apiName updateCategory
 * @apiGroup Category
 * @apiParam {String} id Category ID
 * @apiParam {String} [categoryName] Category Name
 * @apiParam {String} [description] Category Description
 * @apiParam {Number} [isActive] Category Status
 * @apiSuccess {Object} Category updated successfully!
 * @apiError {Object} Category not found
 * @apiError {Object} Invalid ObjectId
 * TODO: Add Logic for image upload
 */
const updateCategory = async (req, res) => {
	if (!req.body.categoryName) {
		return res.status(400).json({
			message: 'Enter Categor Name!',
		});
	}

	const categoryId = req.params.id;
	let categoryName = req.body.categoryName;
	let description = req.body?.description;
	let isActive = req.body.isActive ? req.body.isActive : 1;

	let newCategory = {
		category: categoryName,
		description: description,
		isActive: isActive,
	};
	console.log('newCategory', newCategory);
	if (mongoose.Types.ObjectId.isValid(categoryId)) {
		const updatedCategory = await yogaworkoutCategory.findByIdAndUpdate(
			categoryId,
			newCategory,
			{
				new: true, // Return the updated document
				runValidators: true, // Run schema validators on update
			}
		);
		if (!updatedCategory) {
			return res.status(404).json({ error: 'Category not found' });
		}

		res.json(updatedCategory);
	} else {
		res.status(500).send({
			message: 'Invalid ObjectId',
		});
	}
};

// TODO: Add Logic for check dependency on parent-child records/models
const deleteCategory = async (req, res) => {
	const categoryId = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(categoryId)) {
		return res.status(400).json({ error: 'Invalid category ID' });
	}

	try {
		// Find the user by ID and delete
		const deletedCategory = await yogaworkoutCategory.findByIdAndDelete(
			categoryId
		);

		if (!deletedCategory) {
			return res.status(404).json({ error: 'Category not found' });
		}

		res.json({ message: 'Category deleted successfully', deletedCategory });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete Category' });
	}
};

module.exports = { getAllCategories, addCategory, updateCategory, deleteCategory };
