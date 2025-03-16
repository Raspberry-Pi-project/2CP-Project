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

router.get("/getAvailableQuizzes", getQuizzes);
router.get("/getQuizDetails", getQuizDetails);

router.post("/startAttempt",startAttempt);
router.post("/submitAnswers", submitAnswers);


router.get("/getQuizResults", getQuizResults);
router.get("/history", getHistory);

router.get("/profile",getStudents)


module.exports = router;

