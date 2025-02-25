const express = require("express");
const {
    submitAnswer,
    getStudentAnswerForQuiz,
} = require("../controllers/studentAnswersControllers");

const router = express.Router();

router.post("/", submitAnswer);

router.get("/student/:studentId/quiz/:quizId", getStudentAnswerForQuiz);

module.exports = router;