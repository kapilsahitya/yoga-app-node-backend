const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { mongoose } = require("mongoose");

router.post("/login", [
    check("email", "Please Enter a valid Email").isEmail(),
    check("password", "Please enter a valid Password").isLength({
        min: 6
    })
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            });
        }

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
                user: {
                    id: AdminUser.id
                }
            };
            jwt.sign(
                payload,
                "randomString",
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
)

module.exports = router;