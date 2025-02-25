const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// Get Availlable quizzes
const getAvailableQuizzes = async (req, res) => {
    try {
        const quizzes = await prisma.quizzes.findMany({
            select: {
                id: true,
                title: true,
                subject: true,
            },
        });
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: "Error fetching quizzes" });
    }
};


// Get Quiz Details by ID
const getQuizDetails = async (requestAnimationFrame, res) => {
    const { id } = req.params;
    try {
        const quizzes = await prisma.quiz.findUnique({
            where: { id: parseInt(id)},
            include: {
                questions: {
                    select: {
                        id: true,
                        text: true,
                        options: true,
                    },
                },
            },
        });

        if(!quiz) return res.status(404).json({ error: "Quiz not found"});
        res.json(quiz);

    } catch (error) {
        res.status(500).json({ error: "Error fetching quiz details" });    }
};


// Start Quiz 
const startQuiz = async (req, res) => {
    const { id } = req.params;
    const { studentId } = req.body;
    
    try {
        // Check if the student has already started this quiz
        const existingAttempt = await prisma.result.findFirst({ // result or attemps ?
            where: {
                quizId: parseInt(id),
                studentId: parseInt(studentId),
            }
        });

        if (existingAttempt) {
            return res.status(400).json({ error: "You have already started this quiz" });
        }

        // Register start time 
        await prisma.result.create({
            data: {
                studentId: parseInt(studentId),
                quizId: parseInt(id),
                score: 0,
                startTime: new Date(),
            },
        });

        res.json({ message: "Quiz started successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error starting quiz" });
    }
};

// Submit Answers for a Quiz 

const submitAnswers = async (req, res) => {
    const { id } = req.params;
    const { studentId,  answers } = req.body;

    try {
        // Calculate the score
        let score = 0;
        for (const answer of answers) {
            const question = await prisma.questions.findUnique({
                where: { id: answer.questionId },
            });
            if (question.answer === answer.chosenAnswer) {
                score += 1;
            }
            await prisma.student_answers.create({
                data: {
                    //id_answer: answer.questionId,
                    questionId: answer.questionId,
                    studentId,
                    chosenAnswer: answer.chosenAnswer,
                  },
            });
        }

        const totalQuestions = answers.length;
        const finalScore = (score / totalQuestions) * 100;

        await prisma.result.updateMany({
            where: {
                quizId: parseInt(id),
                studentId: parseInt(studentId),
            },
            data: {
                score: finalScore, 
                competedAt: new Date(),

            }

        });

        res.json({ message: "Answers submitted successfully", score: finalScore });
    } catch (error) {
        res.status(500).json({ error: "Error submitting answers" });       
    }
};


//  Get Results for a Quiz
const getQuizResults = async (req, res) => {
    const { id } = req.params;
    const { studentId } = req.body;

    try {   
        const existingAttempt = await prisma.attempt.findFirst({
            where: {
                quizId: parseInt(id),
                studentId: parseInt(studentId),
           
             }

        });  
        if(!result) return res.status(404).json({ error: "Result not found"});
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Error fetching results" });
        
    }    
};


// Get Past Quizzes taken by Student
const getPastQuizzes = async (req, res) => {
    const { studentId } = req.body;
    try {
        const pastQuizzes = await prisma.result.findMany({
            where: { studentId: parseInt(studentId)},
            include: {
                quiz: {
                    select: {
                        title: true,
                        subject: true,
                    },
                },
            },
        });
        res.json(pastQuizzes);
    } catch (error) {
        res.status(500).json({ error: "Error fetching past quizzes" });
    }
};



module.exports = {
    getAvailableQuizzes,
    getQuizDetails,
    submitAnswers,
    getQuizResults,
    getPastQuizzes,
};