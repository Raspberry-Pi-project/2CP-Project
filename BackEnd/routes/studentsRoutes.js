const express = require("express");
const {
    submitAnswers,
    getQuizResults,
    getHistory,
    getStudents,
    getStudentProfile
} = require("../controllers/studentsControllers");
const { getQuizzes, getQuizDetails } = require("../controllers/quizControllers");
const { startAttempt } = require("../controllers/attemptsController");
// Import the studentAnswersController
const studentAnswersController = require("../controllers/studentAnswersControllers");

const { authenticateUser } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/getAvailableQuizzes", getQuizzes);
router.get("/getQuizDetails/:id_quiz", getQuizDetails);

router.post("/startAttempt", startAttempt);
router.post("/submitAnswers", submitAnswers);

// Add the missing routes for saving answers and submitting quiz
router.post("/saveAnswer", studentAnswersController.saveAnswer);
router.post("/submitQuiz", studentAnswersController.submitQuiz);

router.get("/getQuizResults", getQuizResults);

router.get("/history", getHistory);
// Get the list of all students admin only
router.get("/profile", getStudents);
// Get the personnal profile
router.get("/studentProfile", authenticateUser, getStudentProfile);

// Add this route to your existing routes
router.get('/getSavedAnswers/:id_attempt', studentAnswersController.getSavedAnswers);

module.exports = router;

