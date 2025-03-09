const express = require("express");
const {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    getQuestionsByQuiz,
    updateQuestion,
    deleteQuestion,
} = require("../controllers/questionsControllers");

const router = express.Router();

router.get("/", getAllQuestions);

router.get("/quiz/:id_quiz", getQuestionById);

router.post("/", createQuestion);

router.get("/quiz/:id_quiz", getQuestionsByQuiz);

router.put("/:id_question", updateQuestion);

router.put("/:id_question", deleteQuestion);

module.exports = router;