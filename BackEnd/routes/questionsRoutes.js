const express = require("express");
const {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    getQuestionsByQuiz,
    updateQuestion,
    deleteQuestion,
    getAllQuestionsWithAnswers,
    calculatePercentage,

} = require("../controllers/questionsControllers");

const router = express.Router();

router.get("/", getAllQuestions);

router.get("/quiz/:id_quiz", getQuestionById);

router.post("/", createQuestion);

router.get("/quiz/:id_quiz/questions", getQuestionsByQuiz);

router.put("/:id_question", updateQuestion);

router.delete("/:id_question", deleteQuestion);

router.get("/", getAllQuestionsWithAnswers);

router.get("/calculatePercentage",calculatePercentage);


module.exports = router;