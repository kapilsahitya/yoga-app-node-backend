const mongoose = require('mongoose');

const discoverSchema = new mongoose.Schema(
	{
		discover: {
			type: String,
			required: true,
		},
		image: {
			type: String,
		},
		description: {
			type: String,
		},
		// discoverId:{
		//     type: Number,
		//     unique: true
		// },
		isActive: {
			type: Number,
			enum: [1, 0],
			default: 1,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true, collection: 'yogaworkoutDiscover' }
);

module.exports = mongoose.model('yogaworkoutDiscover', discoverSchema);
