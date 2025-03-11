const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


// Get Availlable quizzes
const getAvailableQuizzes = async (req, res) => {
    try {
        const quizzes = await prisma.quizzes.findMany({
            select: {
                id_quiz: true,
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
const getQuizDetails = async (req, res) => {
    const { id_quiz } = req.params;
    try {
        const quiz = await prisma.quizzes.findUnique({
            where: { id_quiz: parseInt(id_quiz)},
            include: {
                questions: {
                    select: {
                        id_question: true, 
                        question_text: true,
                        answers: {
                            select: {
                                id_answer: true,
                                answer_text: true,
                                correct: true
                            }
                        }
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
    const { id_quiz } = req.params;
    const { id_student } = req.body;
    
    try {
        // Check if the student has already started this quiz
        const existingAttempt = await prisma.result.findFirst({ // result or attemps ?
            where: {
                id_quiz: parseInt(id_quiz),
                id_student: parseInt(id_student),
            }
        });

        if (existingAttempt) {
            return res.status(400).json({ error: "You have already started this quiz" });
        }

        // Register start time 
        await prisma.result.create({
            data: {
                id_student: parseInt(studentId),
                id_quiz: parseInt(id),
                score: 0,
               // startTime: new Date(),
            },
        });

        res.json({ message: "Quiz started successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error starting quiz" });
    }
};

// Submit Answers for a Quiz 

const submitAnswers = async (req, res) => {
    const { id_quiz } = req.params;
    const { id_student,  answers } = req.body;

    try {
        // Calculate the score
        let score = 0;

        for (const answer of answers) {
            const correctAnswer = await prisma.answers.findFirst({
                where: { id_question: answer.questionId,
                    correct: 1
                },
            });

            if (correctAnswer && correctAnswer.id_answer === answer.id_answer) {
                score += 1;
            }
            await prisma.student_answers.create({
                data: {
                    //id_answer: answer.questionId,
                    id_attempt: answer.questionId,
                    //studentId,
                    //chosenAnswer: answer.chosenAnswer,
                    id_question: answer.id_question,
                    student_answer_text: answer.student_answer_text
                  },
            });
        }

        const totalQuestions = answers.length;
        const finalScore = (score / totalQuestions) * 100;

        await prisma.result.updateMany({
            where: {
                id_quiz: parseInt(id_quiz),
                id_student: parseInt(id_student),
            },
            data: {
                score: finalScore, 
               // competedAt: new Date(),

            }

        });

        res.json({ message: "Answers submitted successfully", score: finalScore });
    } catch (error) {
        res.status(500).json({ error: "Error submitting answers" });       
    }
};


//  Get Results for a Quiz
const getQuizResults = async (req, res) => {
    const { id_quiz } = req.params;
    const { id_student } = req.body;

    try {   
        const existingAttempt = await prisma.attempt.findFirst({
            where: {
                id_quiz: parseInt(id_quiz),
                id_student: parseInt(id_student),
           
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
    const { id_quiz } = req.params;
    const { id_student } = req.body;
    try {
        const pastQuizzes = await prisma.result.findMany({
            where: { id_student: parseInt(id_student)},
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


//Calclate the number of participants without duplicates 
const countParticipants = async (req, res) => { 
    try {
        const count = await prisma.students.count({
            distinct: ['id_student'], // Ensure unique students
        });

        res.status(200).json({ totalStudents: count });
    }catch (error) {
        console.error("Error counting participants:", error);
        res.status(500).json({ error: "Error counting participants", details: error.message });
    }
};



module.exports = {
    getAvailableQuizzes,
    getQuizDetails,
    submitAnswers,
    getQuizResults,
    getPastQuizzes,
    countParticipants
};