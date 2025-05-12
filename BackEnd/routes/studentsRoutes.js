const express = require("express");
const {
    submitAnswers,
    getQuizResults,
    getHistory,
    getStudents,

    
} = require("../controllers/studentsControllers");
const { getQuizzes, getQuizDetails } = require("../controllers/quizControllers");
const { startAttempt, getAttemptById, getQuizAttempts, getAttemptAnswers } = require("../controllers/attemptsController");



const router = express.Router();

router.post("/getAvailableQuizzes", getQuizzes);
router.post("/getQuizDetails", getQuizDetails);

router.post("/startAttempt",startAttempt);
router.post("/submitAnswers", submitAnswers);

router.post("/getAttemptById", getAttemptById);

router.post("/getQuizAttempts/:id_quiz", getQuizAttempts);

router.post("/getAttemptAnswers", getAttemptAnswers);

router.post("/getQuizResults", getQuizResults);
router.post("/history", getHistory);

router.post("/profile",getStudents)




module.exports = router;

//
