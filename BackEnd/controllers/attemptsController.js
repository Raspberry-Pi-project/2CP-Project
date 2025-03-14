const { PrismaClient } = require("@prisma/client");
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
            if (numberAttempts >= quiz.totale_attempts) {
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



 // Submit an Attempt 
 const submitAttempt = async (req, res) => {
    const { id_attempt, score } = req.body;
    try {
        // Check if the attempt exists
        const attempt = await prisma.attempt.findUnique({ where: { id_attempt } });
        if (!attempt) {
            return res.status(404).json({ error: "Attempt not found." });
        }
        
        // Update the attempt with the score 
        const submittedAttempt = await prisma.attempt.update({
            where: { id_attempt },
            data: {
                score,
                student_answers: {
                    none: {}
                }
            }
        });

        res.status(200).json({ message: "Attempt submitted successfully", submittedAttempt });
    } catch (error) {
        console.error("Error submitting attempt:", error);
        res.status(500).json({ error: "Error submitting attempt" });
    }
 };




 // Get All Attempts by Student
const getStudentAttempts = async (req, res) => {
    const { id_student } = req.params;
  
    try {
      const attempts = await prisma.attempts.findMany({
        where: { id_student: parseInt(id_student) },
        include: {
          quizzes: {
            select: { title: true }
          }
        }
      });
  
      res.json({ data: attempts });
    } catch (error) {
      console.error("Error fetching student attempts:", error);
      res.status(500).json({ error: "Error fetching student attempts" });
    }
  };
  
  // Get Details of a Specific Attempt
  const getAttemptById = async (req, res) => {
    const { id_attempt } = req.params;
  
    try {
      const attempt = await prisma.attempts.findUnique({
        where: { id_attempt: parseInt(id_attempt) },
        include: {
          quizzes: {
            select: { title: true }
          },
          student_answers: true
        }
      });
  
      if (!attempt) {
        return res.status(404).json({ error: "Attempt not found." });
      }
  
      res.json({ data: attempt });
    } catch (error) {
      console.error("Error fetching attempt:", error);
      res.status(500).json({ error: "Error fetching attempt" });
    }
  };
  

  module.exports = {
    startAttempt,
    submitAttempt,
    getStudentAttempts,
    getAttemptById
  };
    