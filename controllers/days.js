const { mongoose, ObjectId } = require("mongoose");
const yogaworkoutDays = require('../models/days');


const insertDays = async (req, res) => {

    try {
        const week_Id = req.body.week_id;
        let day_name = req.body.day_name;

        const newDay = new yogaworkoutDays({
            week_Id: week_Id,
            daysName: day_name,
        })
        await newDay.save();
        res.status(201).json({ message: 'Day Added successfully!' });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

// const getWeek = async (req, res) => {
//     try {
//         let weeks = await yogaworkoutWeek.find();
//         if (weeks.length === 0) {
//             return res.status(400).json({
//                 message: "No Challenges Added!"
//             });
//         }
//         else {
//             res.status(200).json({
//                 weeks
//             });
//         }
//     }
//     catch (e) {
//         console.error(e);
//         res.status(500).json({
//             message: "Server Error"
//         });
//     }
// }

// const updateWeek = async (req, res) => {
//     const week_Id = req.params.id;
//     const weekName = req.body.week_name;

//     let newWeek = {
//         weekName: weekName,
//     }

//     if (mongoose.Types.ObjectId.isValid(week_Id)) {

//         const updatedWeek = await yogaworkoutWeek.findByIdAndUpdate(week_Id, newWeek, {
//             new: true, // Return the updated document
//             runValidators: true, // Run schema validators on update
//         });
//         if (!updatedWeek) {
//             return res.status(404).json({ error: 'Week not found' });
//         }

//         res.json(updatedWeek);

//     } else {
//         res.status(500).send({
//             message: 'Invalid ObjectId'
//         });
//     }

// }

const deleteDay = async (req, res) => {
    const dayId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(dayId)) {
        return res.status(400).json({ error: 'Invalid Day ID' });
    }

    try {
        // Find the user by ID and delete
        const deletedDay = await yogaworkoutDays.deleteOne({ _id: dayId });

        if (deletedDay.deletedCount === 0) {
            return res.status(404).json({ error: 'Day not found' });
        }

        res.json({ message: 'day deleted successfully', deletedDay });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete Day' });
    }
}

module.exports = { insertDays, deleteDay }