const { mongoose } = require('mongoose');
const yogaworkoutUser = require('../models/user');

const getAllUser = async (req, res) => {
	try {
		let Users = await yogaworkoutUser.find().sort({ createdAt: -1 });
		if (Users.length === 0) {
			return res.status(400).json({
				message: 'No User Added!',
			});
		} else {
			res.status(200).json({
				User: Users,
			});
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

module.exports = {
	getAllUser,
};
