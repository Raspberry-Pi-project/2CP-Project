const { PrismaClient } = require("@prisma/client");

// Create a new instance of PrismaClient with query event logging
const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

// Add event listener for the query event
prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
  console.log('---------------------');
});

// 🟢 **GET a certain number of quizzes (for pagination)**
const getQuizzes = async (req, res) => {
  try {
    const {
      id_student,
      for_year,
      for_groupe,
      page: pageStr = 1,
      limit: limitStr = 10,
      timestamp, // Add timestamp parameter to prevent caching
    } = req.query;
    
    // Convert pagination parameters to integers
    const page = parseInt(pageStr);
    const limit = parseInt(limitStr);
    const studentId = parseInt(id_student);
    let studentYear = parseInt(for_year);
    let studentGroup = for_groupe ? parseInt(for_groupe) : null;
    console.log("Received getQuizzes request:", studentId, "timestamp:", timestamp);
    
          // Fetch all published quizzes
          const publishedQuizzes = await prisma.published_quizzes.findMany({
            select: {
              id_quiz: true,
              published_at: true
            }
           });
           console.log(`Found ${publishedQuizzes.length} published quizzes`);
    // Extract the quiz IDs from the published quizzes
    const publishedQuizIds = publishedQuizzes.map(pq => pq.id_quiz);
    console.log(`Found ${publishedQuizIds.length} published quizzes`);

    // Check if studentId is valid
    if (isNaN(studentId)) {
      return res.status(400).json({ error: "Invalid student ID" });
    }
    
    try {
      if (!studentYear || !studentGroup) {
        const student = await prisma.students.findUnique({
          where: { id_student: studentId },
          select: {
            annee: true,
            groupe_student: true
          }
        });
        if (student) {
          studentYear = studentYear || student.annee;
          studentGroup = studentGroup || student.groupe_student;
        }
      }
    } catch (studentError) {
      console.error("Error fetching student data:", studentError);
      // Continue with the query even if student data fetch fails
    }
    
    // Build filters
    const filters = {};
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
        score: true,
        id_attempt: true,
        attempt_at: true
      }
    });
    
    // Create maps for quick lookups
    const attemptedQuizIds = new Set();
    const completedAttemptsByQuiz = {}; // Track only completed attempts (corrected=1)
    const latestAttempts = {}; // Track the latest attempt for each quiz
    
    studentAttempts.forEach(attempt => {
      const quizId = attempt.id_quiz;
      
      // Add to attempted quizzes set
      attemptedQuizIds.add(quizId);
      
      // Only count completed attempts (corrected=1)
      if (attempt.corrected === 1) {
        if (!completedAttemptsByQuiz[quizId]) {
          completedAttemptsByQuiz[quizId] = [];
        }
        completedAttemptsByQuiz[quizId].push(attempt);
      }
      
      // Track the latest attempt for each quiz
      if (!latestAttempts[quizId] || new Date(attempt.attempt_at) > new Date(latestAttempts[quizId].attempt_at)) {
        latestAttempts[quizId] = attempt;
      }
    });
    
    // Get quizzes that match the criteria
    const quizzes = await prisma.quizzes.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        ...filters,
        id_quiz: {
          in: publishedQuizIds // Only include quizzes that are in the published_quizzes table
        }
      },
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
          }
        },
        published_quizzes: {
          select: {
            published_at: true
          }
        }
      }
    });
    console.log(`Found ${quizzes.length} quizzes`);
    
    // Filter quizzes to include only:
    // 1. Quizzes that have not been attempted, OR
    // 2. Quizzes that have uncompleted attempts (corrected=0), OR
    // 3. Quizzes where completed attempts < nb_attempts
    const filteredQuizzes = quizzes.filter(quiz => {
      const quizId = quiz.id_quiz;
      const completedAttempts = completedAttemptsByQuiz[quizId] || [];
      const latestAttempt = latestAttempts[quizId];
      
      // Count only completed attempts
      const completedAttemptsCount = completedAttempts.length;
      
      // Check if the latest attempt is uncompleted (corrected=0)
      const hasUncorrectedAttempt = latestAttempt && latestAttempt.corrected === 0;
      
      // Check if the student has a successful attempt (score > 0)
      const hasSuccessfulAttempt = completedAttempts.some(attempt => attempt.score > 0);
      
      // If the quiz allows unlimited attempts (nb_attempts = 0)
      if (quiz.nb_attempts === 0) {
        return true;
      }
      
      // If the student has a successful attempt and the quiz only allows one successful attempt
      if (hasSuccessfulAttempt && quiz.nb_attempts === 1) {
        return false;
      }
      
      return (
        // Not attempted OR has uncorrected attempt OR completed attempts < allowed attempts
        !attemptedQuizIds.has(quizId) || 
        hasUncorrectedAttempt || 
        completedAttemptsCount < quiz.nb_attempts
      );
    });
    
    // Add attempt information to each quiz
    const enrichedQuizzes = await Promise.all(filteredQuizzes.map(async quiz => {
      const quizId = quiz.id_quiz;
      const latestAttempt = latestAttempts[quizId];
      const completedAttempts = completedAttemptsByQuiz[quizId] || [];
      
      // Count successful attempts (score > 0)
      const successfulAttempts = completedAttempts.filter(attempt => attempt.score > 0).length;
      
      // Add attempt information
      const attemptsInfo = {
        canAttempt: true,
        remainingAttempts: quiz.nb_attempts === 0 ? "Unlimited" : (quiz.nb_attempts - completedAttempts.length),
        successfulAttempts: successfulAttempts,
        totalAttempts: studentAttempts.filter(a => a.id_quiz === quizId).length,
        completedAttempts: completedAttempts.length,
        latestAttemptId: latestAttempt ? latestAttempt.id_attempt : null,
        hasUncorrectedAttempt: latestAttempt ? latestAttempt.corrected === 0 : false
      };
      
      // If there's a latest attempt, get the student answers
      if (latestAttempt && latestAttempt.id_attempt) {
        const studentAnswers = await prisma.student_answers.findMany({
          where: { id_attempt: latestAttempt.id_attempt }
        });
        
        // Add student answers to the attempt info
        attemptsInfo.studentAnswers = studentAnswers;
      }
      
      return {
        ...quiz,
        attemptsInfo
      };
    }));
    
    // Count total quizzes with the same criteria (for pagination)
    const totalQuizzes = await prisma.quizzes.count({
      where: {
        ...filters,
        id_quiz: {
          in: publishedQuizIds
        }
      }
    });
    
    console.log("Total quizzes found:", enrichedQuizzes.length);
    res.json({
      limit,
      totalPages: Math.ceil(totalQuizzes / limit),
      data: enrichedQuizzes,
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
    const { id_student } = req.query;
    
    // Validate and convert id_quiz to integer
    const quizId = parseInt(id_quiz);
    if (isNaN(quizId)) {
      return res.status(400).json({ error: "Invalid quiz ID format" });
    }

    const quiz = await prisma.quizzes.findUnique({
      where: { id_quiz: quizId },
      include: {
        questions: {
          select: {
            id_question: true,
            question_text: true,
            question_type: true,
            question_number : true,
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

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Add attempt information if student ID is provided
    if (id_student) {
      const studentId = parseInt(id_student);
      
      // In the getQuizDetails function
      if (!isNaN(studentId)) {
        // Get all attempts for this student on this quiz
        const attempts = await prisma.attempts.findMany({
          where: {
            id_student: studentId,
            id_quiz: quizId
          },
          select: {
            id_attempt: true,
            corrected: true,
            score: true,
            attempt_at: true,  // Changed from created_at to attempt_at
          }
        });
        
        // Count successful attempts (corrected and with score > 0)
        const successfulAttempts = attempts.filter(
          attempt => attempt.corrected === 1 && attempt.score > 0
        ).length;
        
        // Count uncorrected attempts
        const uncorrectedAttempts = attempts.filter(
          attempt => attempt.corrected === 0
        ).length;
        
        // Add attempt information to the response
        quiz.attemptsInfo = {
          totalAttempts: attempts.length,
          successfulAttempts: successfulAttempts,
          uncorrectedAttempts: uncorrectedAttempts,
          remainingAttempts: Math.max(0, quiz.nb_attempts - successfulAttempts),
          canAttempt: successfulAttempts < quiz.nb_attempts || uncorrectedAttempts > 0,
          attempts: attempts
        };
      }
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
