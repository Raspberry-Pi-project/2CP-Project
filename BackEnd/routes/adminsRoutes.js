const express = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {getTeachers , updateTeacher , deleteTeacher} = require("../controllers/teachersControllers");
const {getStudents, updateStudent , deleteStudent} = require("../controllers/studentsControllers");
const {register} = require("../controllers/authControllers");
const router = express.Router();


//Teacher routes
router.post("/getTeachers" , getTeachers )
router.put("/updateTeacher" , updateTeacher)
router.delete("/deleteTeacher" , deleteTeacher)


//Students routes
router.post("/getStudents" , getStudents)
router.put("/updateStudent" , updateStudent)
router.delete("/deleteStudent" , deleteStudent)



module.exports = router;
