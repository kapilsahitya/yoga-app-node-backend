const { mongoose } = require('mongoose');
const yogaworkoutPlan = require('../models/plan');

const getAllPlans = async (req, res) => {
	try {
		let Plans = await yogaworkoutPlan.find().sort({ createdAt: -1 });
		if (Plans.length === 0) {
			return res.status(400).json({
				message: 'No Plans Added!',
			});
		} else {
			res.status(200).json({
				plan: Plans,
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

const addPlan = async (req, res) => {
	try {
		if (!req.body.planName) {
			return res.status(400).json({
				message: 'Enter Plan Name!',
			});
		}

		let planName = req.body.planName;
		let price = req.body.price;
		let months = req.body.months;
		let sku_id_android = req.body.sku_id_android ? req.body.sku_id_android : '';
		let sku_id_ios = req.body.sku_id_ios ? req.body.sku_id_ios : '';

		const newPlan = new yogaworkoutStretches({
			plan_name: planName,
			price: price,
			months: months,
			sku_id_android: sku_id_android,
			sku_id_ios: sku_id_ios
		});
		await newPlan.save();
		res.status(201).json({ message: 'New Plan Added successfully!' });
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

const updatePlan = async (req, res) => {
	if (!req.body.planName) {
		return res.status(400).json({
			message: 'Enter Plan Name!',
		});
	}

	const planId = req.params.id;
	let planName = req.body.planName;
	let price = req.body.price;
	let months = req.body.months;
	let sku_id_android = req.body.sku_id_android ? req.body.sku_id_android : '';
	let sku_id_ios = req.body.sku_id_ios ? req.body.sku_id_ios : '';


	let newplan = {
		plan: planName,
		price: price,
		months: months,
		sku_id_android: sku_id_android,
		sku_id_ios: sku_id_ios
	};
	// console.log('newplan', newplan);
	if (mongoose.Types.ObjectId.isValid(planId)) {
		const updatedplan = await yogaworkoutPlan.findByIdAndUpdate(
			planId,
			newplan,
			{
				new: true, // Return the updated document
				runValidators: true, // Run schema validators on update
			}
		);
		if (!updatedplan) {
			return res.status(404).json({ error: 'Plan not found' });
		}

		res.json(updatedplan);
	} else {
		res.status(500).send({
			message: 'Invalid ObjectId',
		});
	}
};

// TODO: Add Logic for check dependency on parent-child records/models
const deletePlan = async (req, res) => {
	const planId = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(planId)) {
		return res.status(400).json({ error: 'Invalid Plan ID' });
	}

	try {
		const documentExists = await yogaworkoutPlan.findOne({ _id: planId, });
		// console.log("documentExists", documentExists)
		if (documentExists) {
			const deletedPlan = await yogaworkoutPlan.deleteOne({
				_id: planId,
			});

			if (deletedPlan.deletedCount === 0) {
				return res.status(404).json({ error: 'Plan not found' });
			}
			// else {
			// 	if (documentExists.image) {
			// 		ImageToDelet = documentExists.image;
			// 		const imageRes = await deleteFile(ImageToDelet);
			// 		// console.log("imageRes", imageRes)
			// 	}
			// }

			res.json({ message: 'Plan deleted successfully', deletedPlan });
		}
		else {

			res.status(500).json({ error: 'No document found to delete.' });
		}

	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete Plan' });
	}
};

// const changePlanStatus = async (req, res) => {
// 	let stretchesId = req.body.id.toString();
// 	let stretchesStatus = req.body.status;

// 	// console.log('req.body', req.body);

// 	if (mongoose.Types.ObjectId.isValid(stretchesId)) {
// 		const updatedStretches = await yogaworkoutStretches.findOneAndUpdate(
// 			{ _id: stretchesId },
// 			{ $set: { isActive: stretchesStatus } },
// 			{ returnDocument: 'after' }
// 		);
// 		// console.log('updatedStretches', updatedStretches);
// 		if (!updatedStretches) {
// 			return res.status(404).json({ error: 'Stretches not found' });
// 		}

// 		res.json(updatedStretches);
// 	} else {
// 		res.status(500).send({
// 			message: 'Invalid ObjectId',
// 		});
// 	}
// };

module.exports = {
	getAllPlans,
	addPlan,
	updatePlan,
	deletePlan,
	// changePlanStatus,
};
