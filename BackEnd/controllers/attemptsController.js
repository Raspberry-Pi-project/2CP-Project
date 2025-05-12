const { PrismaClient } = require("@prisma/client");
const { getQuizzes } = require("./quizControllers");
const prisma = new PrismaClient();

// Start a new attempt
const startAttempt = async (req, res) => {
    const { id_student, id_quiz } = req.body;

    try {
        // Check if the quiz exists 
        const quiz = await prisma.quizzes.findUnique({ where: { id_quiz } });
            if (!quiz) {
                return res.status(404).json({ error: "Quiz not found." });
            }

            // Check if an active attempt already exists for this quiz by the student
            
            const numberAttempts = await prisma.attempts.count({
              where: {
                id_student,
                id_quiz
              }
            })
            if (numberAttempts >= quiz.nb_attempts) {
              return res.status(400).json({ error: "attempt limit reached" });
              
            }
            // Create new attempt
            const newAttempt = await prisma.attempts.create({
                data: {
                    id_student,
                    id_quiz,
                    score: 0,
                    corrected : 0
                }
            });

            res.status(201).json({ message: "Attempt started successfuly", newAttempt });
        
        } catch (error) { 
            console.error("Error starting attempt:");
            res.status(500).json({ error: "Error starting attempt" });
       }

 };
  
  // Get Details of a Specific Attempt
  const getAttemptById = async (req, res) => {
    const { id_attempt } = req.body;
  
    try {
      const attempt = await prisma.attempts.findUnique({
        where: { id_attempt: id_attempt },
      });

      
      if (!attempt) {
        return res.status(404).json({ error: "Attempt not found." });
      }
      
      attempt.quiz = await prisma.quizzes.findUnique({ where: { id_quiz: attempt.id_quiz },
       });

      res.json({ data: attempt });
    } catch (error) {
      console.error("Error fetching attempt:", error);
      res.status(500).json({ error: "Error fetching attempt" });
    }
  };

 
const getQuizAttempts = async (req, res) => {
  
  const { id_quiz } = req.params;
  const {id_student}  = req.body
  console.log(`Fetching attempts for quizId: ${id_quiz}`);  // Debug log

  if ( !id_quiz || isNaN(id_quiz)) {
    return res.status(400).json({ error: 'Invalid quiz ID' });
  }

  try {
    const attempts = await prisma.attempts.findMany({
      where: { id_quiz: parseInt(id_quiz) , id_student },
      orderBy: { attempt_at: 'asc' },
      include: {
        student_answers: true,  // Include student_answers related to each attempt
        students: true,          // Include student information
        quizzes: true,           // Include quiz details     
       },
    });

    console.log('Fetched attempts:', attempts); 

    if ( !attempts ||attempts.length === 0) {
      return res.status(404).json({ message: 'No attempts found for this quiz' });
    }

    res.json({ attempts });
  } catch (error) {
    console.error('Error fetching quiz attempts:', error);
    res.status(500).json({ error: 'Failed to get quiz attempts' });
  }

  //console.log(attempts);  // See if the attempts are returned correctly

};

const getAttemptAnswers = async (req, res) => {
  const { id_attempt } = req.body; // or req.body depending on your API design

  try {
    // 1. Get the attempt details
    const attempt = await prisma.attempts.findUnique({
      where: { id_attempt: parseInt(id_attempt) },
      include: {
        quizzes: {
          include: {
            questions: {
              include: {
                answers: true // Include correct answers
              }
            }
          }
        },
        student_answers: true // Include student's answers
      }
    });

    if (!attempt) {
      return res.status(404).json({ error: "Attempt not found" });
    }

    // 2. Structure the response with question details and student answers
    const result = {
      attemptId: attempt.id_attempt,
      quizId: attempt.id_quiz,
      score: attempt.score,
      corrected: attempt.corrected,
      totalQuestions: attempt.quizzes.questions.length,
      questions: attempt.quizzes.questions.map(question => {
        const studentAnswer = attempt.student_answers.find(
          sa => sa.id_question === question.id_question
        );
        
        return {
          questionId: question.id_question,
          questionText: question.question_text,
          questionType: question.question_type,
          correctAnswers: question.answers.filter(a => a.correct),
          studentAnswer: studentAnswer ? {
            answerText: studentAnswer.student_answer_text,
            isCorrect: studentAnswer.correct,
            submittedAt: studentAnswer.created_at
          } : null
        };
      })
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching attempt answers:", error);
    res.status(500).json({ error: "Failed to get attempt answers" });
  }
};

  // 

  module.exports = {
    startAttempt, 
    getAttemptById,
    getQuizAttempts,
    getAttemptAnswers
  };
    
