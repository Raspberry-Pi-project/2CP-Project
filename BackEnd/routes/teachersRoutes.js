const express = require("express");
const quizRoutes = require("./quizRoutes/quizRoutes");
const { createTeacher } = require("../controllers/teachersControllers");
const router = express.Router();

router.use(express.json())
router.use("/Quizzes",quizRoutes)
router.post("/", createTeacher)

module.exports = router