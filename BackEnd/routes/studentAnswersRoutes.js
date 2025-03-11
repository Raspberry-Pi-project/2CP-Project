const express = require("express");
const {
    submitAnswer,
    getStudentAnswerForQuiz,
    updateAnswer,
    deleteAnswer,
    getAnswersByAttempt,
    getAnswerById
} = require("../controllers/studentAnswersControllers");

const router = express.Router();

router.post("/", submitAnswer);

router.get("/quiz/:id_quiz/student/:id_student", getStudentAnswerForQuiz);

router.put("/:id_student_answer", updateAnswer);

router.delete("/:id_student_answer", deleteAnswer);

router.get("/attempt/:id_attempt", getAnswersByAttempt);

router.get("/:id_student_answer", getAnswerById);

module.exports = router;