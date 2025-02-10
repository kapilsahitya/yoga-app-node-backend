const express = require("express");
const { Login, Dashboard } = require("../../controllers/admin");
const { authenticate } = require("../../middlewares/auth");
const { getAllCategories } = require("../../controllers/category");
const { getAllExercise, addExercise } = require('../../controllers/exercise')
const router = express.Router();

router.post("/login", Login);

router.get('/dashboard', authenticate, Dashboard)

router.get('/category', authenticate, getAllCategories);

router.get('/exercise', authenticate, getAllExercise);

router.post('/addexecise', authenticate, addExercise);

module.exports = router;