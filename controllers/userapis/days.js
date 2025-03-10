const { mongoose, ObjectId } = require('mongoose');
const yogaworkoutChallengesexercise = require('../../models/challengesexercise');
const yogaworkoutDays = require('../../models/days');


/**
 * @api {get} /getDays
 * @apiName getAllDays
 * @apiGroup Day
 * @apiSuccess {Object[]} days Array of all days
 * @apiError {Object} No Challenges Added!
 * @apiError {Object} Server Error
 */
const getDay = async (req, res) => {
	try {

		if (req.body.week_id) {
			let week_id = req.body.week_id;
			const result = await yogaworkoutDays.aggregate([
				{
					$match: { weekId: week_id }
				},
				{
					$lookup: {
						from: 'yogaworkoutChallengesexercise',
						localField: "_id",
						foreignField: "daysId",
						as: 'exercises'
					}
				},
				{
					$project: {
						_id:1,
						daysName: 1,
						weekId:1,
						totalExercises: { $size: "$exercises" }
					}
				}
			])
			res.status(200).json({
				result,
			});
		}
		else {
			res.status(200).json({
				success: 0,
				day: [],
				error: 'Variable not set'
			})
		}

	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};


module.exports = {
	getDay,
};
