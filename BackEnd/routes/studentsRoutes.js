const express = require("express");
const {
    submitAnswers,
    getQuizResults,
    getHistory,
    getStudents
} = require("../controllers/studentsControllers");
const { getQuizzes, getQuizDetails } = require("../controllers/quizControllers");
const { startAttempt } = require("../controllers/attemptsController");

const router = express.Router();

router.post("/getAvailableQuizzes", getQuizzes);
router.post("/getQuizDetails", getQuizDetails);

router.post("/startAttempt",startAttempt);
router.post("/submitAnswers", submitAnswers);


router.post("/getQuizResults", getQuizResults);
router.post("/history", getHistory);

router.post("/profile",getStudents)


module.exports = router;

