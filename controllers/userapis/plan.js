const yogaworkoutPlan = require('../../models/plan');
const { getFile } = require('../../utility/s3');
const { checkUserLogin } = require('./user');
const yogaworkoutPurchasePlan = require('../../models/purchaseplan');
const moment = require('moment');

const getPlan = async (req, res) => {
	try {
		// let totalweekanddaycompleted = await getTotalDayCompleted(item._id,)
		const data = req.body;
		if (
			data.user_id &&
			data.user_id != '' &&
			data.session &&
			data.session != '' &&
			data.device_id &&
			data.device_id != ''
		) {
			const checkuserLogin = await checkUserLogin(
				data.user_id,
				data.session,
				data.device_id
			);
			if (checkuserLogin) {
				let plan = await yogaworkoutPlan
					.find({ isActive: 1 })
					.sort({ createdAt: -1 });
				if (plan.length === 0) {
					return res.status(400).json({
						data: { success: 0, plan: [], error: 'Please Try Again' },
					});
				} else {
					res.status(200).json({
						data: { success: 1, plan: plan, error: '' },
					});
				}
			} else {
				res.status(201).json({
					data: { success: 0, plan: [], error: 'Please login first' },
				});
			}
		} else {
			res.status(200).json({
				data: { success: 0, plan: [], error: 'Variable not set' },
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			data: { success: 0, plan: [], error: 'Server Error' },
		});
	}
};

const cancelPlan = async (req, res) => {
	try {
		const data = req.body;
		if (
			data.user_id &&
			data.user_id != '' &&
			data.session &&
			data.session != '' &&
			data.device_id &&
			data.device_id != '' &&
			data.cancel_date &&
			data.cancel_date != ''
		) {
			const checkuserLogin = await checkUserLogin(
				data.user_id,
				data.session,
				data.device_id
			);
			if (checkuserLogin) {
				// Find the most recent purchase plan for the given user
				const purchasePlan = await yogaworkoutPurchasePlan
					.findOne({ user_id: data.user_id })
					.sort({ createdAt: -1 })
					.exec();

				if (!purchasePlan) {
					return res.status(404).json({
						data: {
							success: 0,
							purchaseplan: {},
							error: 'Purchase plan not found',
						},
					});
				}

				// Update the purchase plan with the cancel date and set total_days to 0
				purchasePlan.total_days = 0;
				purchasePlan.expire_date = cancel_date;

				// Save the updated purchase plan
				await purchasePlan.save();

				// Respond with success
				return res.status(200).json({
					data: { success: 1, purchaseplan: purchasePlan, error: '' },
				});
			} else {
				res.status(201).json({
					data: { success: 0, purchaseplan: [], error: 'Please login first' },
				});
			}
		} else {
			res.status(200).json({
				data: { success: 0, purchaseplan: [], error: 'Variable not set' },
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			data: { success: 0, purchaseplan: [], error: 'Server Error' },
		});
	}
};

const checkPurchasePlanDay = async (req, res) => {
	try {
		const data = req.body;
		if (
			data.user_id &&
			data.user_id != '' &&
			data.session &&
			data.session != '' &&
			data.device_id &&
			data.device_id != ''
		) {
			const checkuserLogin = await checkUserLogin(
				data.user_id,
				data.session,
				data.device_id
			);
			if (checkuserLogin) {
				// Find the most recent purchase plan for the given user
				const purchasePlan = await yogaworkoutPurchasePlan
					.findOne({ user_id: data.user_id })
					.sort({ createdAt: -1 })
					.exec();

				if (!purchasePlan) {
					return res.status(404).json({
						data: {
							success: 0,
							checkpurchaseplanday: {},
							error: 'Purchase plan not found',
						},
					});
				}
				// Extract the values from the document
				const purchasePeriod = purchasePlan.total_days;
				const purchaseDate = moment(purchasePlan.purchase_date);
				const currentDate = moment();
				const diffDays = currentDate.diff(purchaseDate, 'days'); // Get the difference in days

				const expireDay = purchasePeriod - diffDays;

				// Return expire day
				res.status(200).json({
					data: { success: 1, checkpurchaseplanday: expireDay, error: '' },
				});
			} else {
				res.status(201).json({
					data: {
						success: 0,
						checkpurchaseplanday: [],
						error: 'Please login first',
					},
				});
			}
		} else {
			res.status(200).json({
				data: {
					success: 0,
					checkpurchaseplanday: [],
					error: 'Variable not set',
				},
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			data: { success: 0, checkpurchaseplanday: [], error: 'Server Error' },
		});
	}
};

module.exports = { getPlan, cancelPlan, checkPurchasePlanDay };
