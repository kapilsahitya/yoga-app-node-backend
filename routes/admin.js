const express = require("express");
const { Login, Dashboard} = require("../controllers/admin");
const { authenticate } = require("../middlewares/auth")
const router = express.Router();


router.post("/login",Login)

router.get('/dashboard',authenticate,Dashboard)

module.exports = router;