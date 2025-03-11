const express = require("express");
const {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    getQuestionsByQuiz,
    updateQuestion,
    deleteQuestion,
    getAllQuestionsWithAnswers
} = require("../controllers/questionsControllers");

const router = express.Router();

router.get("/", getAllQuestions);

router.get("/quiz/:id_quiz", getQuestionById);

router.post("/", createQuestion);

router.get("/quiz/:id_quiz/questions", getQuestionsByQuiz);

router.put("/:id_question", updateQuestion);

router.delete("/:id_question", deleteQuestion);

router.get("/", getAllQuestionsWithAnswers);

module.exports = router;