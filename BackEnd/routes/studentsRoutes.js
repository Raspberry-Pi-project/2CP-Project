const express = require("express");
const {
    getAvailableQuizzes,
    getQuizDetails,
    submitAnswers,
    getQuizResults,
    getPastQuizzes,
    countParticipants
} = require("../controllers/studentsControllers");

const router = express.Router();

router.get("/", getAvailableQuizzes);
router.get("/:id_quiz", getQuizDetails);
router.post("/", submitAnswers);
router.get("/quiz/:id/results", getQuizResults);
router.get("/past-quizzes", getPastQuizzes);
router.get("/count-participants", countParticipants);

module.exports = router;

