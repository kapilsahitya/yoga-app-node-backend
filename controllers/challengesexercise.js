const { mongoose, ObjectId } = require('mongoose');
const yogaworkoutChallengesexercise = require('../models/challengesexercise');

const addChallengesexercises = async (req, res) => {
	try {
		const day_Id = req.body.day_id;
		if (!req.body.daysName) {
			return res.status(400).json({
				message: 'Enter Day Name!',
			});
		}
		if (!mongoose.Types.ObjectId.isValid(day_Id)) {
			return res.status(400).json({ error: 'Invalid Day ID' });
		}

		const newDay = new yogaworkoutDays({
			day_Id: day_Id,
			daysName: req.body.daysName,
		});
		await newDay.save();
		res.status(201).json({ message: 'Day Added successfully!' });
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

/**
 * @api {get} /getExerciseByDaysId/:id
 * @apiName getExerciseByDaysId
 * @apiGroup Challengesexercise
 * @apiParam {ObjectId} id Day ID
 * @apiSuccess {Object[]} challengesexercises Array of all challengesexercise
 * @apiError {Object} No Challengesexercise Added!
 * @apiError {Object} Server Error
 */
const getExerciseByDaysId = async (req, res) => {
	try {
		const day_Id = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(day_Id)) {
			return res.status(400).json({ error: 'Invalid Day ID' });
		}

		const challengesexercises = await yogaworkoutChallengesexercise.find({
			day_Id: day_Id,
		});
		if (challengesexercises.length === 0) {
			return res.status(400).json({
				message: 'No Challengesexercise Added!',
			});
		} else {
			res.status(200).json({
				challengesexercises,
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
 * @api {delete} /deleteChallengesexercise/:id
 * @apiName deleteChallengesexercise
 * @apiGroup Challengesexercise
 * @apiParam {ObjectId} id Challengesexercise ID
 * @apiSuccess {Object} Challengesexercise deleted successfully!
 * @apiError {Object} Invalid ObjectId
 * @apiError {Object} Challengesexercise not found
 * @apiError {Object} Failed to delete Challengesexercise
 */
const deleteChallengesexercise = async (req, res) => {
	const challengesexerciseId = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(challengesexerciseId)) {
		return res.status(400).json({ error: 'Invalid Challengesexercise ID' });
	}

	try {
		// Find the user by ID and delete
		const deletedChallengesexercise =
			await yogaworkoutChallengesexercise.deleteOne({
				_id: challengesexerciseId,
			});

		if (deletedChallengesexercise.deletedCount === 0) {
			return res.status(404).json({ error: 'Challengesexercise not found' });
		}

		res.json({
			message: 'Challengesexercise deleted successfully',
			deletedChallengesexercise,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete Challengesexercise' });
	}
};

module.exports = {
	addChallengesexercises,
	getExerciseByDaysId,
	deleteChallengesexercise,
};
