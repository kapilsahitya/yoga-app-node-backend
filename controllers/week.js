const { mongoose, ObjectId } = require("mongoose");
const yogaworkoutWeek = require('../models/week');


const insertWeek = async (req, res) => {

    try {
        const challenges_id = req.body.challenges_id;
        let week_name = req.body.week_name;

        const newWeek = new yogaworkoutWeek({
            challenges_Id: challenges_id,
            weekName: week_name,
        })
        await newWeek.save();
        res.status(201).json({ message: 'Week Added successfully!' });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const getWeek = async (req, res) => {
    try {
        let weeks = await yogaworkoutWeek.find();
        if (weeks.length === 0) {
            return res.status(400).json({
                message: "No Challenges Added!"
            });
        }
        else {
            res.status(200).json({
                weeks
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

const updateWeek = async (req, res) => {
    const week_Id = req.params.id;
    const weekName = req.body.week_name;

    let newWeek = {
        weekName: weekName,
    }

    if (mongoose.Types.ObjectId.isValid(week_Id)) {

        const updatedWeek = await yogaworkoutWeek.findByIdAndUpdate(week_Id, newWeek, {
            new: true, // Return the updated document
            runValidators: true, // Run schema validators on update
        });
        if (!updatedWeek) {
            return res.status(404).json({ error: 'Week not found' });
        }

        res.json(updatedWeek);

    } else {
        res.status(500).send({
            message: 'Invalid ObjectId'
        });
    }
}

const deleteWeek = async (req, res) => {
    const weekId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(weekId)) {
        return res.status(400).json({ error: 'Invalid challenges ID' });
    }

    try {
        // Find the user by ID and delete
        const deletedWeek = await yogaworkoutWeek.deleteOne({ _id: weekId });
        // console.log("deletedWeek", deletedWeek)
        if (deletedWeek.deletedCount === 0) {
            return res.status(404).json({ error: 'Week not found' });
        }

        res.json({ message: 'Week deleted successfully', deletedWeek });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
}

module.exports = { insertWeek, getWeek, updateWeek, deleteWeek }