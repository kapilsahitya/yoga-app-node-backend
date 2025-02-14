const mongoose = require('mongoose');

const challengesSchema = new mongoose.Schema(
    {
        challengesId: {
            type: String,
            default: "0"
        },
       
        weekName: {
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
    { timestamps: true, collection: "yogaworkoutWeek" }
)

module.exports = mongoose.model('yogaworkoutWeek', challengesSchema);