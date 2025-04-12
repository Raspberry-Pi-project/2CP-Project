const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🟢 **GET a certain number of quizzes (for pagination)**
const getQuizzes = async (req, res) => {
  try {
    const {
      id_student,
      for_year,
      for_groupe,
      page: pageStr = 1,
      limit: limitStr = 5,
      //id_quiz,
      //title,
      //id_teacher,
      //created_at,
      //subject,
      //status,
      //correctionType,
    } = req.query;
    
    // Convert pagination parameters to integers
    const page = parseInt(pageStr);
    const limit = parseInt(limitStr);
    const studentId = parseInt(id_student);
    let studentYear = parseInt(for_year) ;
    let studentGroup = for_groupe ? parseInt(for_groupe) : null;
    console.log("Received getQuizzes request:", studentId);
    // Check if studentId is valid
    if (isNaN(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }
    try {
      if (!studentYear || !studentGroup) {
        const student = await prisma.students.findUnique({
          where: { id_student: studentId },
          select: {
            annee: true,        // Changed from 'year' to 'annee'
            groupe_student: true // Changed from 'groupe' to 'groupe_student'
          }
        });
        if (student) {
          studentYear = studentYear || student.annee;         // Changed from student.year
          studentGroup = studentGroup || student.groupe_student; // Changed from student.groupe
        }
      }
    } catch (studentError) {
      console.error("Error fetching student data:", studentError);
      // Continue with the query even if student data fetch fails
    }
    
    // Build filters
    const filters = {};
    //if (correctionType) filters.correctionType = correctionType;
    //if (id_quiz) filters.id_quiz = parseInt(id_quiz);
    //if (title) filters.title = { contains: title };
    //if (id_teacher) filters.id_teacher = parseInt(id_teacher);
    //if (created_at) filters.created_at = created_at;
    //if (subject) filters.subject = { contains: subject, mode: "insensitive" };
    //if (status) filters.status = status;
    if (studentYear) filters.for_year = studentYear;
    if (studentGroup) filters.for_groupe = studentGroup;
    
    console.log("Using filters:", JSON.stringify(filters));
    
    // First, get all attempts for this student to check which quizzes they've attempted
    const studentAttempts = await prisma.attempts.findMany({
      where: {
        id_student: studentId
      },
      select: {
        id_quiz: true,
        corrected: true,
        score: true
      }
    });
    
    // Create maps for quick lookups
    const attemptedQuizIds = new Set();
    const uncorrectedQuizIds = new Set();
    const successfulAttemptCounts = {};
    
    studentAttempts.forEach(attempt => {
      // Add to attempted quizzes set
      attemptedQuizIds.add(attempt.id_quiz);
      
      // If uncorrected, add to that set
      if (attempt.corrected === 0) {
        uncorrectedQuizIds.add(attempt.id_quiz);
      }
      
      // Count successful attempts
      if (attempt.corrected === 1 && attempt.score > 0) {
        if (!successfulAttemptCounts[attempt.id_quiz]) {
          successfulAttemptCounts[attempt.id_quiz] = 0;
        }
        successfulAttemptCounts[attempt.id_quiz]++;
      }
    });
    
    // Get quizzes that match the criteria
    const quizzes = await prisma.quizzes.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: filters,
    });
    
    // Filter quizzes to include only:
    // 1. Quizzes that have not been attempted, OR
    // 2. Quizzes that have uncorrected attempts, AND
    // 3. Quizzes where successful attempts < nb_attempts
    const filteredQuizzes = quizzes.filter(quiz => {
      const quizId = quiz.id_quiz;
      const hasBeenAttempted = attemptedQuizIds.has(quizId);
      const hasUncorrectedAttempt = uncorrectedQuizIds.has(quizId);
      const successfulAttempts = successfulAttemptCounts[quizId] || 0;
      
      return (
        // Not attempted OR has uncorrected attempts
        (!hasBeenAttempted || hasUncorrectedAttempt) &&
        // Number of successful attempts is less than allowed attempts
        successfulAttempts < quiz.nb_attempts
      );
    });
    
    // Count total quizzes with the same criteria (for pagination)
    const totalQuizzes = await prisma.quizzes.count({
      where: filters
    });
    
    console.log("Total quizzes found:", filteredQuizzes.length);
    res.json({
      limit,
      totalPages: Math.ceil(totalQuizzes / limit),
      data: filteredQuizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ 
      error: "Error fetching quizzes",
      details: error.message 
    });
  }
};

const createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      id_teacher,
      subject,
      nb_attempts,
      duration,
      correctionType,
      score,
      for_year,
      for_groupe,
      status,
      questions,
    } = req.body;

    const newQuiz = await prisma.quizzes.create({
      data: {
        title,
        description,
        id_teacher,
        subject,
        nb_attempts,
        duration,
        correctionType,
        score,
        for_year,
        for_groupe,
        status, // Save the status
        questions: {
          create: questions.map((question) => ({
            duration: question.duration,
            question_text: question.question_text,
            question_number: question.question_number,
            question_type: question.question_type,
            points: question.points,
            answers: {
              create: question.answers.map((answer) => ({
                answer_text: answer.answer_text,
                correct: answer.correct,
              })),
            },
          })),
        }
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      }
    });
    

    res.json({ newQuiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Error creating quiz" });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const {
      id_quiz,
      title,
      description,
      id_teacher,
      subject,
      nb_attempts,
      duration,
      correctionType,
      score,
      for_year,
      for_groupe,
      status,
      questions,
    } = req.body;

    // Update the quiz
    const updatedQuiz = await prisma.quizzes.update({
      where: {
        id_quiz: id_quiz,
      },
      data: {
        title,
        description,
        id_teacher,
        subject,
        nb_attempts,
        duration,
        correctionType,
        score,
        for_year,
        for_groupe,
        status,
      },
    });

    if (questions.length > 0) {
      // Delete questions marked as deleted
      await prisma.questions.deleteMany({
        where: {
          id_question: {
            in: questions
              .filter((question) => question.deleted === true)
              .map((question) => question.id_question),
          },
        },
      });

      // Process each question
      for (const question of questions) {
        if (question.deleted === false) {
          let updatedQuestion;

          // Update or create the question
          if (question.updated === true) {
            updatedQuestion = await prisma.questions.upsert({
              where: {
                id_question: question.id_question 
              },
              update: {
                duration: question.duration,
                question_text: question.question_text,
                question_number: question.question_number,
                question_type: question.question_type,
                points: question.points,
              },
              create: {
                id_quiz: updatedQuiz.id_quiz,
                duration: question.duration,
                question_text: question.question_text,
                question_number: question.question_number,
                question_type: question.question_type,
                points: question.points,
              },
            });

            // Delete answers marked as deleted
            await prisma.answers.deleteMany({
              where: {
                id_answer: {
                  in: question.answers
                    .filter((answer) => answer.deleted === true)
                    .map((answer) => answer.id_answer),
                },
              },
            });

            // Process each answer
            for (const answer of question.answers) {
              if (answer.deleted === false && answer.updated === true) {
                await prisma.answers.upsert({
                  where: {
                    id_answer: answer.id_answer  
                  },
                  update: {
                    answer_text: answer.answer_text,
                    correct: answer.correct,
                  },
                  create: {
                    id_question: updatedQuestion.id_question,
                    answer_text: answer.answer_text,
                    correct: answer.correct,
                  },
                });
              }
            }
          }
        }
      }
    }

    // Fetch the updated quiz with questions and answers
    const finalQuiz = await prisma.quizzes.findUnique({
      where: {
        id_quiz: updatedQuiz.id_quiz,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    res.json({ quiz: finalQuiz, message: "Quiz updated successfully" });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Error creating quiz" });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id_quiz } = req.body;

    const deletedQuiz = await prisma.quizzes.delete({
      where: {
        id_quiz: id_quiz,
      },
    });
    res.json(deletedQuiz);
  } catch (error) {
    res.status(500).json({ error: "Error deleting quiz" });
  }
};


const getQuizDetails = async (req, res) => {
  try {
    const { id_quiz } = req.params;
    
    // Validate and convert id_quiz to integer
    const quizId = parseInt(id_quiz);
    if (isNaN(quizId)) {
      return res.status(400).json({ error: "Invalid quiz ID format" });
    }

    const quiz = await prisma.quizzes.findUnique({
      where: { id_quiz: quizId },
      include: {
        questions: {
          orderBy: {
            question_number: 'asc'
          },
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
        teachers: {
          select: {
            first_name: true,
            last_name: true,
          }
        }
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    res.json(quiz);
  } catch (error) {
    console.error("Error in getQuizDetails:", error);
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Database constraint violation" });
    } else if (error.code === "P2025") {
      return res.status(404).json({ error: "Record not found in database" });
    } else {
      return res.status(500).json({ 
        error: "Internal server error while fetching quiz details",
        message: error.message
      });
    }
  }
};

module.exports = {
  getQuizzes,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizDetails,
};
