const { mongoose } = require('mongoose');
const yogaworkoutDiscover = require('../models/discover');

/**
 * @api {get} /discover
 * @apiName getAllDiscovers
 * @apiGroup Discover
 * @apiSuccess {Object[]} discovers List of Discover
 * @apiError {Object} Server Error
 * @apiError {Object} No Discovers Added!
 */
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
				message: 'Enter Discover Name!',
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
			message: 'Enter Discover Name!',
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

/**
 * @api {post} /changeDiscoverStatus
 * @apiName changeDiscoverStatus
 * @apiGroup Discover
 * @apiParam {String} id Discover ID
 * @apiParam {Number} status Discover Status
 * @apiSuccess {Object} Discover status changed successfully!
 * @apiError {Object} Discover not found
 * @apiError {Object} Invalid ObjectId
 */
const changeDiscoverStatus = async (req, res) => {
	let discoverId = req.body.id.toString();
	let discoverStatus = req.body.status;

	console.log('req.body', req.body);

	if (mongoose.Types.ObjectId.isValid(discoverId)) {
		const updatedDiscover = await yogaworkoutDiscover.updateOne(
			{ _id: discoverId },
			{ $set: { isActive: discoverStatus } }
		);
		console.log('updatedDiscover', updatedDiscover);
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

module.exports = {
	getAllDiscovers,
	addDiscover,
	updateDiscover,
	deleteDiscover,
	changeDiscoverStatus,
};
