const express = require("express");
const quizRoutes = require("./quizRoutes");

const answersRoutes = require("./answersRoutes");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {getTeachers , updateTeacher , deleteTeacher} = require("../controllers/teachersControllers");
const {getStudents, updateStudent , deleteStudent} = require("../controllers/studentsControllers");
const {register} = require("../controllers/authControllers");
const router = require("./authRoutes");


//create new user
router.post("/RegisterUser", register)

//Teacher routes
router.get("/getTeachers" , getTeachers )
router.put("/updateTeacher" , updateTeacher)
router.delete("/deleteTeacher" , deleteTeacher)


//Students routes
router.get("/getStudents" , getStudents)
router.put("/updateStudent" , updateStudent)
router.delete("/deleteStudent" , deleteStudent)



module.exports = router;
