const express = require("express");
const multer = require('multer');
const { getQuizzes , createQuiz, deleteQuiz, updateQuiz, getQuizDetails } = require("../controllers/quizControllers");
const { getAllResults } = require("../controllers/studentAnswersControllers");
const { getStudents, countParticipants, getQuizResults, getHistory } = require("../controllers/studentsControllers");
const { calculatePercentage } = require("../controllers/questionsControllers");
const { logout } = require("../controllers/authControllers");
const {getTeachers } = require("../controllers/teachersControllers");


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.use(express.json());

//quizzes functions
router.post("/getQuizzes" , getQuizzes)
router.post("/createQuiz",upload.single('file') , createQuiz);
router.post("/deleteQuiz", deleteQuiz);
router.post("/updateQuiz" , updateQuiz);
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
