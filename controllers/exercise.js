const yogaworkoutExercise = require("../models/exercise")

const getAllExercise = async(req,res) => {
    try{
            let exericises = await yogaworkoutExercise.find();
            if(exericises.length === 0)
            {
                return res.status(400).json({
                    message: "No Exericises Added!"
                });
            }
            else{
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

module.exports = { getAllExercise };