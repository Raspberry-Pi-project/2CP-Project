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
      });

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
      include: {
        student_answers: true,
      },
    });
    if (!existingAttempt) {
      res.status(404).json({ error: "Result not found" });
    } else {
      let groupedAnswers = {};
      for (const studentAnswer of existingAttempt.studentAnswers) {
        if (!groupedAnswers[studentAnswer.id_question]) {
          groupedAnswers[studentAnswer.id_question] = [];
        }
        groupedAnswers[studentAnswer.id_question].push(studentAnswer);
      }
      for (const attempt of existingAttempt) {
        attempt.quiz = await prisma.quizzes.findUnique({
          where: { id_quiz: attempt.id_quiz },
          include: {
            questions: {
              select: {
                id_question: true,
                question_text: true,
                question_type: true,
                question_number: true,
                duration: true,
                points: true,
                question_percentage: true,
                answers: {
                  select: {
                    id_answer: true,
                    answer_text: true,
                    correct: true,
                  },
                },
              },
            },
          },
        });

        for (const qst of attempt.questions){
          qst.studentAnswers = groupedAnswers[qst.id_question] || [];
        } 
      }
      

      res.json(existingAttempt);
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching results" });
  }
};

// Get Past Quizzes taken by Student
const getHistory = async (req, res) => {
  const { id_student, page, limit } = req.body;
  try {
    // First, get distinct quiz IDs from attempts
    const distinctQuizIds = await prisma.attempts.findMany({
      where: { id_student: id_student },
      select: {
        id_quiz: true,
      },
      distinct: ["id_quiz"],
      skip: (page - 1) * limit,
      take: limit,
    });

    // Extract just the quiz IDs
    const quizIds = distinctQuizIds.map((attempt) => attempt.id_quiz);

    // Then get the full quiz data for these IDs
    const pastQuizzes = await prisma.quizzes.findMany({
      where: {
        id_quiz: {
          in: quizIds,
        },
        status : "active",
      },
      include: {
        attempts: {
          where: {
            id_student: id_student,
          },
          orderBy: {
            attempt_at: "desc",
          },
        },
      },
    });

    for (quiz of pastQuizzes) {
      const totalQuestions = await prisma.questions.count({
        where: { id_quiz: quiz.id_quiz },
      });
      quiz.totalQuestions = totalQuestions;
    }

    console.log("Past quizzes:", pastQuizzes);

    res.json({
      data: pastQuizzes,
      totalPages: distinctQuizIds.length,
    });
  } catch (error) {
    console.error("Error fetching past quizzes:", error);
    res.status(500).json({ error: "Error fetching past quizzes" });
  }
};

//Calclate the number of participants without duplicates
const countParticipants = async (req, res) => {
  try {
    const { id_quiz } = req.body;
    const count = await prisma.attempts.count({
      where: {
        id_quiz,
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
    if (id_student) filters.id_student = id_student;
    if (created_at) filters.created_at = created_at;
    if (annee) filters.annee = annee;
    if (groupe_student) filters.groupe_student = groupe_student;
    console.log(filters, req.body);
    const students = await prisma.students.findMany({
      skip: (page - 1) * limit, //skip records based on page number
      take: limit, // limit number of students per page
      where: filters,
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
