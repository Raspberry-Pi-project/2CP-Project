
const express = require("express");
const {
    startAttempt,
    submitAttempt,
    getStudentAttempts,
    getAttemptById,
} = require("../controllers/attemptsController");

const router = express.Router();

router.post("/start", startAttempt);

router.post("/submit", submitAttempt);

router.get("/student/:id_student", getStudentAttempts);

router.get("/attempt/:id_attempt", getAttemptById);


module.exports = router;