const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/adminuser');
const { mongoose } = require("mongoose");

const Login = async (req, res) => {
    // const errors = validationResult(req);
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({
    //         errors: errors.array()
    //     });
    // }

    const { email, password } = req.body;
    try {
        const db = mongoose.connection.db;
        const collection = db.collection('yogaworkoutAdmin');
        let AdminUser = await collection.findOne({ email });
        console.log("AdminUser", AdminUser)
        if (!AdminUser) {
            return res.status(400).json({
                message: "User Not Exist"
            });
        }
        // const isMatch = await bcrypt.compare(password, AdminUser.password);
        if (!(AdminUser.password === password))
            return res.status(400).json({
                message: "Incorrect Password !"
            });

        const payload = {
            userId: AdminUser._id
        };
        console.log("payload", payload)
        jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {
                expiresIn: 3600
            },
            (err, token) => {
                if (err) throw err;
                res.status(200).json({
                    token
                });
            }
        );
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Server Error"
        });
    }
}

const Dashboard = async (req, res) => {
    const db = mongoose.connection.db;
    const categories = await db.collection('yogaworkoutCategory').count();
    const exercise = await db.collection('yogaworkoutExercise').count();
    const challenges = await db.collection('yogaworkoutChallenges').count();
    const discover = await db.collection('yogaworkoutDiscover').count();
    const quickworkout = await db.collection('yogaworkoutQuickworkout').count();
    const stretches = await db.collection('yogaworkoutStretches').count();

    res.status(200).json({
        categories,
        exercise,
        challenges,
        discover,
        quickworkout,
        stretches
    });
}

module.exports = { Dashboard, Login };