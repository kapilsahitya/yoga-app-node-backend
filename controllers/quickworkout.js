const { mongoose } = require('mongoose');
const yogaworkoutQuickworkout = require('../models/quickworkout');

const getAllQuickworkouts = async (req, res) => {
	try {
		let quickworkouts = await yogaworkoutQuickworkout.find();
		if (quickworkouts.length === 0) {
			return res.status(400).json({
				message: 'No Quickworkout Added!',
			});
		} else {
			res.status(200).json({
				quickworkouts,
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
 * @api {post} /addquickworkout
 * @apiName addQuickworkout
 * @apiGroup Quickworkout
 * @apiParam {String} quickworkoutName Quickworkout Name
 * @apiParam {String} [description] Quickworkout Description
 * @apiParam {Number} [isActive] Quickworkout Status
 * @apiSuccess {Object} Quickworkout added successfully!
 * @apiError {Object} Server Error
 * TODO: Add Logic for image upload
 */
const addQuickworkout = async (req, res) => {
	try {
		if (!req.body.quickworkoutName) {
			return res.status(400).json({
				message: 'Enter Quick Workout Name!',
			});
		}

		let quickworkoutName = req.body.quickworkoutName;
		let description = req.body?.description;
		let isActive = req.body.isActive ? req.body.isActive : 1;

		const newQuickworkout = new yogaworkoutQuickworkout({
			quickworkout: quickworkoutName,
			description: description,
			isActive: isActive,
		});
		await newQuickworkout.save();
		res.status(201).json({ message: 'Quickworkout Added successfully!' });
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

/**
 * @api {post} /updatequickworkout/:id
 * @apiName updateQuickworkout
 * @apiGroup Quickworkout
 * @apiParam {String} id Quickworkout ID
 * @apiParam {String} [quickworkoutName] Quickworkout Name
 * @apiParam {String} [description] Quickworkout Description
 * @apiParam {Number} [isActive] Quickworkout Status
 * @apiSuccess {Object} Quickworkout updated successfully!
 * @apiError {Object} Quickworkout not found
 * @apiError {Object} Invalid ObjectId
 * TODO: Add Logic for image upload
 */
const updateQuickworkout = async (req, res) => {
	if (!req.body.quickworkoutName) {
		return res.status(400).json({
			message: 'Enter Quick Workout Name!',
		});
	}

	const quickworkoutId = req.params.id;
	let quickworkoutName = req.body.quickworkoutName;
	let description = req.body?.description;
	let isActive = req.body.isActive ? req.body.isActive : 1;

	let newQuickworkout = {
		quickworkout: quickworkoutName,
		description: description,
		isActive: isActive,
	};
	console.log('newQuickworkout', newQuickworkout);
	if (mongoose.Types.ObjectId.isValid(quickworkoutId)) {
		const updatedQuickworkout = await yogaworkoutQuickworkout.findByIdAndUpdate(
			quickworkoutId,
			newQuickworkout,
			{
				new: true, // Return the updated document
				runValidators: true, // Run schema validators on update
			}
		);
		if (!updatedQuickworkout) {
			return res.status(404).json({ error: 'Quickworkout not found' });
		}

		res.json(updatedQuickworkout);
	} else {
		res.status(500).send({
			message: 'Invalid ObjectId',
		});
	}
};

// TODO: Add Logic for check dependency on parent-child records/models
const deleteQuickworkout = async (req, res) => {
	const quickworkoutId = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(quickworkoutId)) {
		return res.status(400).json({ error: 'Invalid quickworkout ID' });
	}

	try {
		// Find the user by ID and delete
		const deletedQuickworkout = await yogaworkoutQuickworkout.findByIdAndDelete(
			quickworkoutId
		);

		if (!deletedQuickworkout) {
			return res.status(404).json({ error: 'Quickworkout not found' });
		}

		res.json({
			message: 'Quickworkout deleted successfully',
			deletedQuickworkout,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete Quickworkout' });
	}
};

/**
 * @api {post} /changeQuickworkoutStatus
 * @apiName changeQuickworkoutStatus
 * @apiGroup Quickworkout
 * @apiParam {String} id Quickworkout ID
 * @apiParam {Number} status Quickworkout Status
 * @apiSuccess {Object} Quickworkout status changed successfully!
 * @apiError {Object} Quickworkout not found
 * @apiError {Object} Invalid ObjectId
 */
const changeQuickworkoutStatus = async (req, res) => {
	let quickworkoutId = req.body.id.toString();
	let quickworkoutStatus = req.body.status;

	console.log('req.body', req.body);

	if (mongoose.Types.ObjectId.isValid(quickworkoutId)) {
		const updatedQuickworkout = await yogaworkoutQuickworkout.updateOne(
			{ _id: quickworkoutId },
			{ $set: { isActive: quickworkoutStatus } }
		);
		console.log('updatedQuickworkout', updatedQuickworkout);
		if (!updatedQuickworkout) {
			return res.status(404).json({ error: 'Quickworkout not found' });
		}

		res.json(updatedQuickworkout);
	} else {
		res.status(500).send({
			message: 'Invalid ObjectId',
		});
	}
};

module.exports = {
	getAllQuickworkouts,
	addQuickworkout,
	updateQuickworkout,
	deleteQuickworkout,
	changeQuickworkoutStatus,
};
