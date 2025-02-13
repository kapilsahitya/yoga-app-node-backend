const { mongoose } = require("mongoose");
const yogaworkoutStretches = require('../models/stretches');

const getAllStretches = async (req, res) => {
	try {
		let stretchess = await yogaworkoutStretches.find();
		if (stretchess.length === 0) {
			return res.status(400).json({
				message: 'No Stretches Added!',
			});
		} else {
			res.status(200).json({
				stretchess,
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
 * @api {post} /addstretches
 * @apiName addStretches
 * @apiGroup Stretches
 * @apiParam {String} stretchesName Stretches Name
 * @apiParam {String} [description] Stretches Description
 * @apiParam {Number} [isActive] Stretches Status
 * @apiSuccess {Object} Stretches added successfully!
 * @apiError {Object} Server Error
 * TODO: Add Logic for image upload
 */
const addStretches = async (req, res) => {
	try {
		if (!req.body.stretchesName) {
			return res.status(400).json({
				message: 'Enter Stretch Name!',
			});
		}

		let stretchesName = req.body.stretchesName;
		let description = req.body?.description;
		let isActive = req.body.isActive ? req.body.isActive : 1;

		const newStretches = new yogaworkoutStretches({
			stretches: stretchesName,
			description: description,
			isActive: isActive,
		});
		await newStretches.save();
		res.status(201).json({ message: 'Stretch Added successfully!' });
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

/**
 * @api {post} /updatestretches/:id
 * @apiName updateStretches
 * @apiGroup Stretches
 * @apiParam {String} id Stretches ID
 * @apiParam {String} [stretchesName] Stretches Name
 * @apiParam {String} [description] Stretches Description
 * @apiParam {Number} [isActive] Stretches Status
 * @apiSuccess {Object} Stretches updated successfully!
 * @apiError {Object} Stretches not found
 * @apiError {Object} Invalid ObjectId
 * TODO: Add Logic for image upload
 */
const updateStretches = async (req, res) => {
	if (!req.body.stretchesName) {
		return res.status(400).json({
			message: 'Enter Stretch Name!',
		});
	}

	const stretchesId = req.params.id;
	let stretchesName = req.body.stretchesName;
	let description = req.body?.description;
	let isActive = req.body.isActive ? req.body.isActive : 1;

	let newStretches = {
		stretches: stretchesName,
		description: description,
		isActive: isActive,
	};
	console.log('newStretches', newStretches);
	if (mongoose.Types.ObjectId.isValid(stretchesId)) {
		const updatedStretches = await yogaworkoutStretches.findByIdAndUpdate(
			stretchesId,
			newStretches,
			{
				new: true, // Return the updated document
				runValidators: true, // Run schema validators on update
			}
		);
		if (!updatedStretches) {
			return res.status(404).json({ error: 'Stretch not found' });
		}

		res.json(updatedStretches);
	} else {
		res.status(500).send({
			message: 'Invalid ObjectId',
		});
	}
};

// TODO: Add Logic for check dependency on parent-child records/models
const deleteStretches = async (req, res) => {
	const stretchesId = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(stretchesId)) {
		return res.status(400).json({ error: 'Invalid Stretch ID' });
	}

	try {
		// Find the user by ID and delete
		const deletedStretches = await yogaworkoutStretches.findByIdAndDelete(
			stretchesId
		);

		if (!deletedStretches) {
			return res.status(404).json({ error: 'Stretch not found' });
		}

		res.json({ message: 'Stretch deleted successfully', deletedStretches });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete Stretch' });
	}
};

module.exports = { getAllStretches, addStretches, updateStretches, deleteStretches };
