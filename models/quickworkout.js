const mongoose = require('mongoose');

const quickworkoutSchema = new mongoose.Schema(
	{
		quickworkout: {
			type: String,
			required: true,
		},
		image: {
			type: String,
		},
		description: {
			type: String,
		},
		// quickworkoutId:{
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
	{ timestamps: true, collection: 'yogaworkoutQuickworkout' }
);

module.exports = mongoose.model('yogaworkoutQuickworkout', quickworkoutSchema);
