const express = require("express");
const quizRoutes = require("./quizRoutes");

const answersRoutes = require("./answersRoutes");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  createTeacher,
  getTeachers,
  deleteTeacher,
  deleteTeachersGroupe,
  updateTeacher,
  changeTeachersGroupe,
} = require("../controllers/teachersControllers");
const router = express.Router();

router.use(express.json());

router.use("/Quizzes", quizRoutes);
router.use("/answers", answersRoutes);


router.post("/createTeacher", createTeacher);
router.get("/getTeachers", getTeachers);
router.delete("/deleteTeacher", deleteTeacher);
router.delete("/deleteTeachersGroupe", deleteTeachersGroupe);
router.put("/updateTeacher", updateTeacher);
router.put("/changeTeachersGroupe", changeTeachersGroupe);



module.exports = router;
