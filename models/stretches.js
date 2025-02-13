const mongoose = require('mongoose');

const stretchesSchema = new mongoose.Schema(
	{
		stretches: {
			type: String,
			required: true,
		},
		image: {
			type: String,
		},
		description: {
			type: String,
		},
		// stretchesId:{
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
	{ timestamps: true, collection: 'yogaworkoutStretches' }
);

module.exports = mongoose.model('yogaworkoutStretches', stretchesSchema);
