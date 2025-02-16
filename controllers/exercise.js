const { mongoose } = require('mongoose');
const yogaworkoutExercise = require('../models/exercise');
const { uploadFile, getFile, deleteFile } = require('../utility/s3');

const getAllExercise = async (req, res) => {
	try {
		let exercises = await yogaworkoutExercise.find();
		if (exercises.length === 0) {
			return res.status(400).json({
				message: 'No Exericises Added!',
			});
		} else {
			const exercisesWithImages = await Promise.all(
				exercises.map(async (item) => {
					const updatedItem = item.toObject ? item.toObject() : item;
					if (item.image !== '') {
						const imageurl = await getFile(item.image); // Assuming getFile is an async function
						// console.log("imageurl", imageurl);
						return { ...updatedItem, image: imageurl }; // Update the image URL
					}
					return updatedItem; // Return the item unchanged if no image update is needed
				})
			);

			res.status(200).json({
				exercises: exercisesWithImages,
			});
			
		}
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

const addExercise = async (req, res) => {
	try {
		if (!req.body.exerciseName) {
			return res.status(400).json({
				message: 'Enter Exercise Name!',
			});
		}
		if (!req.body.exerciseTime) {
			return res.status(400).json({
				message: 'Enter Exercise Time in Minutes!',
			});
		}

		let image = '';
		if (req.file) {
			// return res.status(400).send('No file uploaded.');
			const imageRes = await uploadFile(req.file, 'Exercise');
			// console.log("imageRes", imageRes) 
			if (imageRes && imageRes.Key) {
				image = imageRes.Key
			}
		}

		let exerciseName = req.body.exerciseName;
		let exerciseTime = req.body.exerciseTime;
		let description = req.body?.description;
		let isActive = req.body.isActive ? req.body.isActive : 1;

		const newExercise = new yogaworkoutExercise({
			exerciseName: exerciseName,
			exerciseTime: exerciseTime,
			description: description,
			isActive: isActive,
			image: image
		});
		await newExercise.save();
		res.status(201).json({ message: 'Exercise Added successfully!' });
	} catch (e) {
		console.error(e);
		res.status(500).json({
			message: 'Server Error',
		});
	}
};

const updateExercise = async (req, res) => {
	const exerciseId = req.params.id;
	let exerciseName = req.body.exerciseName;
	let exerciseTime = req.body.exerciseTime;
	let description = req.body?.description;
	let isActive = req.body.isActive ? req.body.isActive : 1;

	let newExercise = {
		exerciseName: exerciseName,
		exerciseTime: exerciseTime,
		description: description,
		isActive: isActive,
	};
	console.log('newExercise', newExercise);
	if (mongoose.Types.ObjectId.isValid(exerciseId)) {
		const updatedExercise = await yogaworkoutExercise.findByIdAndUpdate(
			exerciseId,
			newExercise,
			{
				new: true, // Return the updated document
				runValidators: true, // Run schema validators on update
			}
		);
		if (!updatedExercise) {
			return res.status(404).json({ error: 'Exercise not found' });
		}

		res.json(updatedExercise);
	} else {
		res.status(500).send({
			message: 'Invalid ObjectId',
		});
	}
};

const deleteExercise = async (req, res) => {
	const exerciseId = req.params.id;

	if (!mongoose.Types.ObjectId.isValid(exerciseId)) {
		return res.status(400).json({ error: 'Invalid exercise ID' });
	}

	try {
		// Find the user by ID and delete
		const deletedExercise = await yogaworkoutExercise.findByIdAndDelete(
			exerciseId
		);

		if (!deletedExercise) {
			return res.status(404).json({ error: 'Exercise not found' });
		}

		res.json({ message: 'Exercise deleted successfully', deletedExercise });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Failed to delete Exercise' });
	}
};

/**
 * @api {post} /changeExerciseStatus
 * @apiName changeExerciseStatus
 * @apiGroup Exercise
 * @apiParam {String} id Exercise ID
 * @apiParam {Number} status Exercise Status
 * @apiSuccess {Object} Exercise status changed successfully!
 * @apiError {Object} Exercise not found
 * @apiError {Object} Invalid ObjectId
 */
const changeExerciseStatus = async (req, res) => {
	let exerciseId = req.body.id.toString();
	let exerciseStatus = req.body.status;

	console.log('req.body', req.body);

	if (mongoose.Types.ObjectId.isValid(exerciseId)) {
		const updatedExercise = await yogaworkoutExercise.updateOne(
			{ _id: exerciseId },
			{ $set: { isActive: exerciseStatus } }
		);
		console.log('updatedExercise', updatedExercise);
		if (!updatedExercise) {
			return res.status(404).json({ error: 'Exercise not found' });
		}

		res.json(updatedExercise);
	} else {
		res.status(500).send({
			message: 'Invalid ObjectId',
		});
	}
};

module.exports = {
	getAllExercise,
	addExercise,
	updateExercise,
	deleteExercise,
	changeExerciseStatus,
};
