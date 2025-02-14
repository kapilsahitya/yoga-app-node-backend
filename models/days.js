const mongoose = require('mongoose');

const challengesSchema = new mongoose.Schema(
    {

        week_Id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'yogaworkoutWeek',
            required: true,
            index: true,
        },
        // weekId: {
        //     type: String,
        // },
        daysName: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }

    },
    { timestamps: true, collection: "yogaworkoutDays" }
)

module.exports = mongoose.model('yogaworkoutDays', challengesSchema);