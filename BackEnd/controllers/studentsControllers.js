const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// Submit Answers for a Quiz

const submitAnswers = async (req, res) => {
  const { id_attempt, answers, score } = req.body;

  try {
    for (const answer of answers) {
      const attempt = await prisma.attempts.findUnique({
        where: {
          id_attempt: id_attempt,
        },
      })

      const studentAnswer = await prisma.student_answers.create({
        data: {
          id_attempt: id_attempt,
          id_question: answer.id_question,
          student_answer_text: answer.student_answer_text,
          correct: answer.correct,
        },
      });
    }

    await prisma.attempts.update({
      where: {
        id_attempt,
      },
      data: {
        score,
        corrected: 1,
      },
    });

    res.json({ message: "Answers submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting answers" });
  }
};

//  Get Results for a Quiz
const getQuizResults = async (req, res) => {
  const { id_student, id_quiz } = req.body;

  try {
    const existingAttempt = await prisma.attempts.findMany({
      where: {
        id_quiz: id_quiz,
        id_student: id_student,
      },
      include : {
        student_answers : true
      }
    });
    if (!existingAttempt) {
      res.status(404).json({ error: "Result not found" });
    } else {
      for (const attempt of existingAttempt) {
        attempt.quiz = await prisma.quizzes.findUnique({ where: { id_quiz: attempt.id_quiz } });
      }
      res.json(existingAttempt);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching results" });
  }
};

// Get Past Quizzes taken by Student
const getHistory = async (req, res) => {
  const { id_student , page , limit } = req.body;
  try {
    const pastQuizzes = await prisma.attempts.findMany({
      skip: (page - 1) * limit, //skip records based on page number
      take: limit, // limit number of attempts per page
      where: { id_student: id_student },
      distinct: ["id_quiz"],
      include: {
        quiz: true,
      },
    });
    const totale_attempts = await prisma.attempts.count({
      where: { id_student: id_student },
      distinct:["id_quiz"]
    })
    res.json({
      data: pastQuizzes,
      totale_attempts
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching past quizzes" });
  }
};

//Calclate the number of participants without duplicates
const countParticipants = async (req, res) => {
  try {
    const {id_quiz} = req.body
    const count = await prisma.attempts.count({
        where: {
          id_quiz
        },
      distinct: ["id_student"], // Ensure unique students
    });

    res.status(200).json({ totalStudents: count });
  } catch (error) {
    console.error("Error counting participants:", error);
    res
      .status(500)
      .json({ error: "Error counting participants", details: error.message });
  }
};

const getStudents = async (req, res) => {
  try {
    const {
      page,
      limit,
      first_name,
      last_name,
      email,
      id_student,
      annee,
      groupe_student,
      created_at,
    } = req.body;
    const filters = {};
    if (first_name) filters.first_name = { contains: first_name };
    if (last_name) filters.last_name = { contains: last_name };
    if (email) filters.email = { contains: email };
    if (id_student) filters.id_teacher = id_student;
    if (created_at) filters.created_at = created_at;
    if (annee) filters.annee = annee;
    if (groupe_student) filters.groupe_student = groupe_student;
    const students = await prisma.students.findMany({
      skip: (page - 1) * limit, //skip records based on page number
      take: limit, // limit number of students per page
      where: filters,
      select: {
        id_student: true,
        first_name: true,
        last_name: true,
        email: true,
        annee: true,
        groupe_student: true,
        created_at: true,
      },
    });
    const totalStudents = await prisma.students.count({
      where: filters,
    });
    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalStudents / limit),
      data: students,
    });
  } catch (error) {
    res.status(500).json({ error: "Error getting students" });
  }
};

const updateStudent = async (req, res) => {
  const {
    id_student,
    first_name,
    last_name,
    email,
    annee,
    groupe_student,
    password,
  } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedStudent = await prisma.students.update({
      where: { id_student: id_student },
      data: {
        password: hashedPassword,
        first_name,
        last_name,
        email,
        annee,
        groupe_student,
      },
    });
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ error: "Error updating student" });
  }
};

const deleteStudent = async (req, res) => {
  const { id_student } = req.body;
  try {
    const deletedStudent = await prisma.students.delete({
      where: { id_student: id_student },
    });
    res.json(deletedStudent);
  } catch (error) {
    res.status(500).json({ error: "Error deleting student" });
  }
};

module.exports = {
  submitAnswers,
  getQuizResults,
  getHistory,
  countParticipants,
  getStudents,
  updateStudent,
  deleteStudent,
};
