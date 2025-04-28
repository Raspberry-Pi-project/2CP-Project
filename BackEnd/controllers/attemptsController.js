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
  

  module.exports = {
    startAttempt,
    getAttemptById
  };
    