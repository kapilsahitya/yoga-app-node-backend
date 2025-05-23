const mongoose = require('mongoose');
// const yogaworkoutDays = require('./days');

const daysCompletedSchema = new mongoose.Schema(
	{
		week_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'yogaworkoutWeek',
			required: true,
			index: true,
		},

		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'yogaworkoutUser',
			required: true,
			index: true,
		},
		days_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'yogaworkoutdays',
			required: true,
			index: true,
		},

		is_completed: {
			type: Number,
			emun: [0, 1],
			default: 0,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ timestamps: true, collection: 'yogaworkoutDaysCompleted' }
);



module.exports = mongoose.model('yogaworkoutDaysCompleted', daysCompletedSchema);
