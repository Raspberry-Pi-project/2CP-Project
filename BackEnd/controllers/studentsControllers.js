const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

// Submit Answers for a Quiz

/*const submitAnswers = async (req, res) => {
  console.log(req.body);
  const { id_attempt, answers, score } = req.body;
  let id_attempt1= parseInt(id_attempt);
  let score1 = parseInt(score);
  try {
    for (const answer of answers) {
      const attempt = await prisma.attempts.findUnique({
        where: {
          id_attempt: id_attempt1,
        },
      })

      const studentAnswer = await prisma.student_answers.create({
        data: {
          id_attempt: id_attempt1,
          id_question: answer.id_question,
          student_answer_text: answer.student_answer_text,
          correct: answer.correct,
        },
      });
    }

    await prisma.attempts.update({
      where: {
        id_attempt1,
      },
      data: {
        score1,
        corrected: 1,
      },
    });

    res.json({ message: "Answers submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error submitting answers" });
  }
};*/

const submitAnswers = async (req, res) => {
  console.log(req.body);
  const { id_attempt, answers, score } = req.body;

  try {
    // First verify the attempt exists
    const attemptExists = await prisma.attempts.findUnique({
      where: {
        id_attempt: id_attempt,
      },
    });
    
    if (!attemptExists) {
      return res.status(404).json({ error: "Attempt not found" });
    }
    
    // Check if answers already exist for this attempt
    const existingAnswers = await prisma.student_answers.count({
      where: {
        id_attempt: id_attempt,
      },
    });
    
    if (existingAnswers > 0) {
      return res.status(400).json({ error: "Answers already submitted for this attempt" });
    }

    // Create all answers in a transaction
    await prisma.$transaction(
      answers.map(answer => 
        prisma.student_answers.create({
          data: {
            id_attempt: id_attempt,
            id_question: answer.id_question,
            student_answer_text: answer.student_answer_text,
            correct: answer.correct,
          },
        })
      )
    );

    // Update the attempt with the score
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
    console.error("Error submitting answers:", error);
    res.status(500).json({ 
      error: "Error submitting answers", 
      details: error.message 
    });
  }
};
//  Get Results for a Quiz
const getQuizResults = async (req, res) => {
  const { id_student, id_quiz } = req.query;
  //id_student = parseInt(id_student);
  //id_quiz = parseInt(id_quiz);
  console.log(id_student, id_quiz);
  let id_student1 = parseInt(id_student);
  let id_quiz1 = parseInt(id_quiz);
  try {
    const existingAttempt = await prisma.attempts.findMany({
      where: {
        id_quiz: id_quiz1,
        id_student: id_student1,
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
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ error: "Error fetching results" });
  }
};

// Get Past Quizzes taken by Student
const getHistory = async (req, res) => {
  const { id_student, page = 1, limit = 10 } = req.query;
  let id_student1 = parseInt(id_student);
  let page1 = parseInt(page);
  let limit1 = parseInt(limit);
  //let id_quiz1 = parseInt(id_quiz);
  console.log(id_student1, page1, limit1);
  try {
    const pastQuizzes = await prisma.attempts.findMany({
      skip: (page1 - 1) * limit, //skip records based on page number
      take: limit1, // limit number of attempts per page
      where: { id_student: id_student1 },
      distinct: ["id_quiz"],
      include: {
        quizzes: true,
      },
    });
    //console.log(pastQuizzes);
    const totale_attempts = await prisma.attempts.count({
      where: { id_student: id_student1 },
      //distinct:["id_quiz"]
    });
    //console.log(totale_attempts);
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
  console.log({request:req.query});
  try {
    const {
      page = 1,
      limit = 10,
      first_name,
      last_name,
      email,
      id_student,
      annee,
      groupe_student,
      created_at,
    } = req.query;
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


// Modify the getStudents function to handle both query params and JWT token

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

// Get Student Profile using JWT token
const getStudentProfile = async (req, res) => {
  try {
    // Log the request for debugging
    console.log("Student Profile Request:", {
      query: req.query,
      headers: req.headers
    });
    
    // Get parameters from query
    const { id_student, email } = req.query;
    let user;   
    
    // Check if at least one parameter is provided
    if (!id_student && !email) {
      return res.status(400).json({ error: "Missing required parameters: id_student or email" });
    }
    
    // Build the where clause based on provided parameters
    const whereClause = {};
    if (id_student) whereClause.id_student = parseInt(id_student);
    if (email) whereClause.email = email;
    
    console.log("Searching with criteria:", whereClause);
    
    // Find the student based on provided parameters
    user = await prisma.students.findFirst({
      where: whereClause
    });
    
    if (!user) {
      console.log("No student found with criteria:", whereClause);
      return res.status(404).json({ message: "Student not found." });
    }
    
    // Remove sensitive data before sending response
    //const { password, ...userWithoutPassword } = user;
    
    //console.log("Fetched user:", userWithoutPassword);
    //res.status(200).json(userWithoutPassword);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ error: "Error fetching student profile", details: error.message });
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
  getStudentProfile,
};
