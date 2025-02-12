const express = require('express');
const { Login, Dashboard } = require('../../controllers/admin');
const { authenticate } = require('../../middlewares/auth');
const categoryController = require('../../controllers/category');
const exerciseController = require('../../controllers/exercise');
const challengesController = require('../../controllers/challenges');
const discoverController = require('../../controllers/discover');
const router = express.Router();

router.post('/login', Login);

router.get('/dashboard', authenticate, Dashboard);

// START: category module
router.get('/category', authenticate, categoryController.getAllCategories);
router.post('/addcategory', authenticate, categoryController.addCategory);
router.post(
	'/updatecategory/:id',
	authenticate,
	categoryController.updateCategory
);
// END: category module

// START: exercise module
router.get('/exercise', authenticate, exerciseController.getAllExercise);
router.post('/addexercise', authenticate, exerciseController.addExercise);
router.post(
	'/updateexercise/:id',
	authenticate,
	exerciseController.updateExercise
);
router.post(
	'/deleteexercise/:id',
	authenticate,
	exerciseController.deleteExercise
);
// END: exercise module

// START: challenges module
router.get('/challenges', authenticate, challengesController.getAllChallenges);
router.post('/addchallenges', authenticate, challengesController.addChallenges);
router.post(
	'/updatechallenges/:id',
	authenticate,
	challengesController.updateChallenges
);
router.post(
	'/deletechallenges/:id',
	authenticate,
	challengesController.deleteChallenges
);
// END: challenges module

// START: discover module
router.get('/discover', authenticate, discoverController.getAllDiscovers);
router.post('/adddiscover', authenticate, discoverController.addDiscover);
router.post(
	'/updatediscover/:id',
	authenticate,
	discoverController.updateDiscover
);
// END: discover module

module.exports = router;
