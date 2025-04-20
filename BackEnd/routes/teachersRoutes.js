const express = require("express");

const { getQuizzes , createQuiz, deleteQuiz, updateQuiz, getQuizDetails } = require("../controllers/quizControllers");
const { getAllResults } = require("../controllers/studentAnswersControllers");
const { getStudents, countParticipants, getQuizResults, getHistory } = require("../controllers/studentsControllers");
const { calculatePercentage } = require("../controllers/questionsControllers");
const { logout } = require("../controllers/authControllers");
const {getTeachers } = require("../controllers/teachersControllers");

const router = express.Router();

router.use(express.json());

//quizzes functions
router.post("/getQuizzes" , getQuizzes)
router.post("/createQuiz", createQuiz);
router.put("/deleteQuiz" , deleteQuiz);
router.put("/updateQuiz" , updateQuiz);
router.post("/getQuizDetails" , getQuizDetails);

//students functions
router.post("/getStudents" , getStudents)
router.post("countParticipants",countParticipants)
router.post("/getStudentResults", getQuizResults);
router.post("/getStudentHistory", getHistory);


router.post("/getTeachers" , getTeachers )


router.put("/calculatePercentage",calculatePercentage);
router.post("/getAllResults", getAllResults);


module.exports = router;
