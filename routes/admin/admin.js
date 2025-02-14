const express = require('express');
const { Login, Dashboard } = require('../../controllers/admin');
const { authenticate } = require('../../middlewares/auth');
const categoryController = require('../../controllers/category');
const exerciseController = require('../../controllers/exercise');
const challengesController = require('../../controllers/challenges');
const discoverController = require('../../controllers/discover');
const quickworkoutController = require('../../controllers/quickworkout');
const stretchesController = require('../../controllers/stretches');
const weekController = require('../../controllers/week');
const daysController = require('../../controllers/days');
const router = express.Router();

router.post('/login', Login);

router.get('/dashboard', authenticate, Dashboard);

// START: category module
router.get('/category', authenticate, categoryController.getAllCategories);
router.post('/addCategory', authenticate, categoryController.addCategory);
router.post(
	'/updateCategory/:id',
	authenticate,
	categoryController.updateCategory
);
router.post(
	'/deleteCategory/:id',
	authenticate,
	categoryController.deleteCategory
);
router.post(
	'/changeCategoryStatus',
	authenticate,
	categoryController.changeCategoryStatus
);
// END: category module

// START: exercise module
router.get('/exercise', authenticate, exerciseController.getAllExercise);
router.post('/addExercise', authenticate, exerciseController.addExercise);
router.post(
	'/updateExercise/:id',
	authenticate,
	exerciseController.updateExercise
);
router.post(
	'/deleteExercise/:id',
	authenticate,
	exerciseController.deleteExercise
);
router.post(
	'/changeExerciseStatus',
	authenticate,
	exerciseController.changeExerciseStatus
);
// END: exercise module

// START: challenges module
router.get('/challenges', authenticate, challengesController.getAllChallenges);
router.post('/addChallenges', authenticate, challengesController.addChallenges);
router.post(
	'/updateChallenges/:id',
	authenticate,
	challengesController.updateChallenges
);
router.post(
	'/deleteChallenges/:id',
	authenticate,
	challengesController.deleteChallenges
);
router.post(
	'/changeChallengesStatus',
	authenticate,
	challengesController.changeChallengesStatus
);
// END: challenges module

// START: week module
router.get(
	'/getWeeksByChallengesId/:id',
	authenticate,
	weekController.getWeeksByChallengesId
);
router.get('/getWeeks', authenticate, weekController.getAllWeeks);
router.post('/addWeek', authenticate, weekController.addWeek);
router.post('/updateWeek/:id', authenticate, weekController.updateWeek);
router.post('/deleteWeek/:id', authenticate, weekController.deleteWeek);
// END: week module

// START: day module
router.get(
	'/getDaysByWeekId/:id',
	authenticate,
	daysController.getDaysByWeekId
);
router.post('/addDay', authenticate, daysController.addDay);
router.post('/updateDay/:id', authenticate, daysController.updateDay);
router.post('/deleteDay/:id', authenticate, daysController.deleteDay);
// END: day module

// START: discover module
router.get('/discover', authenticate, discoverController.getAllDiscovers);
router.post('/addDiscover', authenticate, discoverController.addDiscover);
router.post(
	'/updateDiscover/:id',
	authenticate,
	discoverController.updateDiscover
);
router.post(
	'/deleteDiscover/:id',
	authenticate,
	discoverController.deleteDiscover
);
router.post(
	'/changeDiscoverStatus',
	authenticate,
	discoverController.changeDiscoverStatus
);
// END: discover module

// START: quickworkout module
router.get(
	'/quickworkout',
	authenticate,
	quickworkoutController.getAllQuickworkouts
);
router.post(
	'/addQuickworkout',
	authenticate,
	quickworkoutController.addQuickworkout
);
router.post(
	'/updateQuickworkout/:id',
	authenticate,
	quickworkoutController.updateQuickworkout
);
router.post(
	'/deleteQuickworkout/:id',
	authenticate,
	quickworkoutController.deleteQuickworkout
);
router.post(
	'/changeQuickworkoutStatus',
	authenticate,
	quickworkoutController.changeQuickworkoutStatus
);
// END: quickworkout module

// START: stretches module
router.get('/stretches', authenticate, stretchesController.getAllStretches);
router.post('/addStretches', authenticate, stretchesController.addStretches);
router.post(
	'/updateStretches/:id',
	authenticate,
	stretchesController.updateStretches
);
router.post(
	'/deleteStretches/:id',
	authenticate,
	stretchesController.deleteStretches
);
router.post(
	'/changeStretchesStatus',
	authenticate,
	stretchesController.changeStretchesStatus
);
// END: stretches module

module.exports = router;
