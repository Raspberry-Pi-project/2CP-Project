const express = require("express");
const {
    getAvailableQuizzes,
    getQuizDetails,
    submitAnswers,
    getQuizResults,
    getPastQuizzes,
} = require("../controllers/studentsControllers");

const router = express.Router();

router.get("/quizzes", getAvailableQuizzes);
router.get("/quiz/:id", getQuizDetails);
router.post("/quiz/:id/submit", submitAnswers);
router.get("/quiz/:id/results", getQuizResults);
router.get("/past-quizzes", getPastQuizzes);

module.exports = router;

