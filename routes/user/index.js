const express = require('express');
const router = express.Router();
const categoryController = require('../../controllers/userapis/category');
const exerciseController = require('../../controllers/userapis/exercise');
const challengesController = require('../../controllers/userapis/challenges');
const discoverController = require('../../controllers/userapis/discover');
const quickworkoutController = require('../../controllers/userapis/quickworkout');
const stretchesController = require('../../controllers/userapis/stretches');
const settingController = require('../../controllers/userapis/settings');
const weekController = require('../../controllers/userapis/week');
const dayController = require('../../controllers/userapis/days');
const challengesExerciseController = require('../../controllers/userapis/challengesexercise');
const homeWorkoutController = require('../../controllers/userapis/homeworkout');
const categoryExerciseController = require('../../controllers/userapis/categoryexercise');
const userController = require('../../controllers/userapis/user');
const weekCompletedController = require('../../controllers/userapis/weekcompleted');
const dayCompletedController = require('../../controllers/userapis/daycompleted');
const workoutCompletedController = require('../../controllers/userapis/workoutcompleted');

//START : User Module
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/checkalreadyregister', userController.checkAlreadyRegister);
router.post('/forgotpassword', userController.forgotPassword);
router.post('/changepassword', userController.changePassword);

// START: exercise module
router.get('/exercise', exerciseController.getAllExercise);
// END: exercise module

// START: category module
router.get('/category', categoryController.getAllCategories);
router.post(
	'/categoryexercise',
	categoryExerciseController.getExerciseByCategoryId
);
// END: category module

// START: challenges module
router.post('/challenges', challengesController.getAllChallenges);
router.post('/getweek', weekController.getWeek);
router.post('/weekcompleted', weekCompletedController.weekCompleted);
router.post('/daycompleted', dayCompletedController.dayCompleted);
router.post('/workoutcompleted', workoutCompletedController.workoutCompleted);
router.post('/getdays', dayController.getDay);
router.post(
	'/challengesexercise',
	challengesExerciseController.getChallengesExercise
);
// END: challenges module

// START: discover module
router.get('/discover', discoverController.getAllDiscovers);
// END: discover module

// START: quickworkout module
router.get('/quickworkout', quickworkoutController.getAllQuickworkouts);
// END: quickworkout module

// START: stretches module
router.get('/stretches', stretchesController.getAllStretches);
// END: stretches module

// START: settings module
router.get('/settings', settingController.settings);
// END: settings module

// START: homeWorkout module
// TODO: Check authentication for below
router.post('/gethomeworkout', homeWorkoutController.getHomeWorkout);
// END: homeWorkout module

module.exports = router;
