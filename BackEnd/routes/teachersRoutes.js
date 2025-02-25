const express = require("express");
const quizRoutes = require("./quizRoutes");
const { createTeacher } = require("../controllers/teachersControllers");
const router = express.Router();

router.use(express.json())
router.use("/quiz",quizRoutes)
router.post("/", createTeacher)

module.exports = router