const yogaworkoutExercise = require("../models/exercise")

const getAllExercise = async (req, res) => {
    try {
        let exericises = await yogaworkoutExercise.find();
        if (exericises.length === 0) {
            return res.status(400).json({
                message: "No Exericises Added!"
            });
        }
        else {
            res.status(200).json({
                exericises
            });
        }
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const addExercise = async (req, res) => {
    try {
        if(!req.body.exerciseName)
        {
            return res.status(400).json({
                message: "Enter Exercise Name!"
            });
        }
        if(!req.body.exerciseTime)
        {
            return res.status(400).json({
                message: "Enter Exercise Time in Minutes!"
            });
        }
            
        let exerciseName = req.body.exerciseName;
        let exerciseTime = req.body.exerciseTime;
        let description = req.body?.description;
        let isActive = 1

        const newExercise = new yogaworkoutExercise({
            exerciseName: exerciseName,
            exerciseTime:exerciseTime,
            description : description,
            isActive : isActive,
        })
        await newExercise.save();
        res.status(201).json({ message: 'Exercise Added successfully!' });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

module.exports = { getAllExercise, addExercise };