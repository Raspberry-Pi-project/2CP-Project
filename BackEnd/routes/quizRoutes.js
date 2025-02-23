const express = require("express");
const router = express.Router();
const {
  getQuizzes,
  createQuiz,
  deleteQuizzes,
} = require("../controllers/quizControllers");

router.use(express.json());
router.get("/getQuizzes", getQuizzes);

router.post("/createQuiz", createQuiz);
router.delete("/deleteQuizzes", deleteQuizzes);

module.exports = router;
