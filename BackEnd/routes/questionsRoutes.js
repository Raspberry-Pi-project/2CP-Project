const express = require("express");
const {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    updateQuestion,
    deleteQuestion,
} = require("../controllers/questionsControllers");

const router = express.Router();

router.get("/", getAllQuestions);

router.get("/:id", getQuestionById);

router.post("/", createQuestion);

router.put("/:id", updateQuestion);

router.put("/:id", deleteQuestion);

module.exports = router;