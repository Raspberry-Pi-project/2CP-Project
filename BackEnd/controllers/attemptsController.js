const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Start a new attempt
const startAttempt = async (req, res) => {
    const { id_student, id_quiz } = req.body;

    try {
        console.log("Starting attempt with:", { id_student, id_quiz });
        
        // Validate input parameters
        if (!id_student || !id_quiz) {
            return res.status(400).json({ error: "Missing required fields: id_student and id_quiz are required" });
        }
        
        // Check if the quiz exists 
        const quiz = await prisma.quizzes.findUnique({ 
            where: { id_quiz },
            include: {
                questions: true // Include questions to validate quiz structure
            }
        });
        
        if (!quiz) {
            return res.status(404).json({ error: "Quiz not found." });
        }
        
        // Validate that the quiz has questions
        if (!quiz.questions || quiz.questions.length === 0) {
            return res.status(400).json({ error: "This quiz has no questions and cannot be attempted." });
        }

        // Get all attempts for this student on this quiz
        const attempts = await prisma.attempts.findMany({
            where: {
                id_student,
                id_quiz
            },
            include: {
                student_answers: true // Include answers to check completion status
            },
            orderBy: {
                attempt_at: 'desc' // Get most recent attempts first
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
        
        // Check if there's an in-progress attempt (uncorrected with some answers)
        const inProgressAttempt = attempts.find(
            attempt => attempt.corrected === 0 && attempt.student_answers.length > 0
        );
        
        if (inProgressAttempt) {
            // Return the existing in-progress attempt instead of creating a new one
            return res.status(200).json({ 
                message: "Resuming existing attempt", 
                newAttempt: inProgressAttempt,
                attemptsInfo: {
                    totalAttempts: attempts.length,
                    successfulAttempts: successfulAttempts,
                    uncorrectedAttempts: uncorrectedAttempts,
                    remainingAttempts: Math.max(0, quiz.nb_attempts - successfulAttempts),
                    canAttempt: true,
                    isResumed: true
                }
            });
        }
        
        // Check if student has reached the attempt limit
        if (successfulAttempts >= quiz.nb_attempts && uncorrectedAttempts === 0) {
            return res.status(400).json({ 
                error: "attempt limit reached",
                attemptsInfo: {
                    totalAttempts: attempts.length,
                    successfulAttempts: successfulAttempts,
                    uncorrectedAttempts: uncorrectedAttempts,
                    remainingAttempts: Math.max(0, quiz.nb_attempts - successfulAttempts),
                    canAttempt: false
                }
            });
        }
            
        // Create new attempt
        const newAttempt = await prisma.attempts.create({
            data: {
                id_student,
                id_quiz,
                score: 0,
                corrected: 0
            }
        });

        console.log("New attempt created successfully:", newAttempt);

        res.status(201).json({ 
            message: "Attempt started successfully", 
            newAttempt,
            attemptsInfo: {
                totalAttempts: attempts.length + 1,
                successfulAttempts: successfulAttempts,
                uncorrectedAttempts: uncorrectedAttempts + 1,
                remainingAttempts: Math.max(0, quiz.nb_attempts - successfulAttempts),
                canAttempt: true,
                isResumed: false
            }
        });
        
    } catch (error) { 
        console.error("Error starting attempt:", error);
        // Send more detailed error information
        res.status(500).json({ 
            error: "Error starting attempt", 
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

// Get Details of a Specific Attempt
const getAttemptById = async (req, res) => {
    const { id_attempt } = req.body;
  
    try {
        const attempt = await prisma.attempts.findUnique({
            where: { id_attempt: id_attempt },
            include: {
                student_answers: true, // Include student answers
                quizzes: {
                    include: {
                        questions: {
                            include: {
                                answers: true // Include question answers
                            }
                        }
                    }
                }
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

// Add a new function to submit a quiz and calculate the score
const submitQuiz = async (req, res) => {
    const { id_attempt } = req.body;
    
    try {
        // Get the attempt with all related data
        const attempt = await prisma.attempts.findUnique({
            where: { id_attempt },
            include: {
                student_answers: true,
                quizzes: {
                    include: {
                        questions: {
                            include: {
                                answers: true
                            }
                        }
                    }
                }
            }
        });
        
        if (!attempt) {
            return res.status(404).json({ error: "Attempt not found" });
        }
        
        if (attempt.corrected === 1) {
            return res.status(400).json({ error: "This attempt has already been submitted" });
        }
        
        // Calculate the score based on correct answers
        let totalPoints = 0;
        let earnedPoints = 0;
        
        // Create a map of question IDs to their points
        const questionPoints = {};
        attempt.quizzes.questions.forEach(question => {
            questionPoints[question.id_question] = question.points;
            totalPoints += question.points;
        });
        
        // Calculate earned points from student answers
        attempt.student_answers.forEach(answer => {
            if (answer.correct === 1) {
                earnedPoints += questionPoints[answer.id_question] || 0;
            }
        });
        
        // Calculate percentage score
        const score = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;
        
        // Update the attempt with the score and mark as corrected
        const updatedAttempt = await prisma.attempts.update({
            where: { id_attempt },
            data: {
                score,
                corrected: 1
            }
        });
        
        // Return the results
        res.status(200).json({
            message: "Quiz submitted successfully",
            results: {
                score,
                totalPoints,
                earnedPoints,
                attemptId: id_attempt,
                quizTitle: attempt.quizzes.title,
                quizId: attempt.quizzes.id_quiz
            }
        });
        
    } catch (error) {
        console.error("Error submitting quiz:", error);
        res.status(500).json({ error: "Error submitting quiz" });
    }
};
  
module.exports = {
    startAttempt,
    getAttemptById,
    submitQuiz
};
    