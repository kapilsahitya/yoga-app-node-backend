const { mongoose } = require("mongoose");
const yogaworkoutDiscover = require('../models/discover');

const getAllDiscovers = async (req, res) => {
	try {
		let discovers = await yogaworkoutDiscover.find();
		if (discovers.length === 0) {
			return res.status(400).json({
				message: 'No Discovers Added!',
			});
		} else {
			res.status(200).json({
				discovers,
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
 * @api {post} /adddiscover
 * @apiName addDiscover
 * @apiGroup Discover
 * @apiParam {String} discoverName Discover Name
 * @apiParam {String} [description] Discover Description
 * @apiParam {Number} [isActive] Discover Status
 * @apiSuccess {Object} Discover added successfully!
 * @apiError {Object} Server Error
 * TODO: Add Logic for image upload
 */
const addDiscover = async (req, res) => {
	try {
		if (!req.body.discoverName) {
			return res.status(400).json({
				message: 'Enter Categor Name!',
			});
		}

		let discoverName = req.body.discoverName;
		let description = req.body?.description;
		let isActive = req.body.isActive ? req.body.isActive : 1;

		const newDiscover = new yogaworkoutDiscover({
			discover: discoverName,
			description: description,
			isActive: isActive,
		});
		await newDiscover.save();
		res.status(201).json({ message: 'Discover Added successfully!' });
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

/**
 * @api {post} /updatediscover/:id
 * @apiName updateDiscover
 * @apiGroup Discover
 * @apiParam {String} id Discover ID
 * @apiParam {String} [discoverName] Discover Name
 * @apiParam {String} [description] Discover Description
 * @apiParam {Number} [isActive] Discover Status
 * @apiSuccess {Object} Discover updated successfully!
 * @apiError {Object} Discover not found
 * @apiError {Object} Invalid ObjectId
 * TODO: Add Logic for image upload
 */
const updateDiscover = async (req, res) => {
	if (!req.body.discoverName) {
		return res.status(400).json({
			message: 'Enter Categor Name!',
		});
	}

	const discoverId = req.params.id;
	let discoverName = req.body.discoverName;
	let description = req.body?.description;
	let isActive = req.body.isActive ? req.body.isActive : 1;

	let newDiscover = {
		discover: discoverName,
		description: description,
		isActive: isActive,
	};
	console.log('newDiscover', newDiscover);
	if (mongoose.Types.ObjectId.isValid(discoverId)) {
		const updatedDiscover = await yogaworkoutDiscover.findByIdAndUpdate(
			discoverId,
			newDiscover,
			{
				new: true, // Return the updated document
				runValidators: true, // Run schema validators on update
			}
		);
		if (!updatedDiscover) {
			return res.status(404).json({ error: 'Discover not found' });
		}

		res.json(updatedDiscover);
	} else {
		res.status(500).send({
			message: 'Invalid ObjectId',
		});
	}
};

// TODO: Add Logic for check dependency on parent-child records/models
const deleteDiscover = async (req, res) => {
	const discoverId = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(discoverId)) {
		return res.status(400).json({ error: 'Invalid discover ID' });
	}

	try {
		// Find the user by ID and delete
		const deletedDiscover = await yogaworkoutDiscover.findByIdAndDelete(
			discoverId
		);

		if (!deletedDiscover) {
			return res.status(404).json({ error: 'Discover not found' });
		}

		res.json({ message: 'Discover deleted successfully', deletedDiscover });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete Discover' });
	}
};

module.exports = { getAllDiscovers, addDiscover, updateDiscover, deleteDiscover };
