const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Submit an answer 
const submitAnswer = async(req, res) => {
    try {
        const { questionId, studentId, chosenAnswer } = req.body;

        // Check if the answer already exists to avoid duplicates
        const existingAnswer = await prisma.student_answers.findFirst({
            where: { questionId, studentId }        
        });

        if (existingAnswer) {
            return res.status(400).json({ error: "You have already submitted an answer for this question." });
        }

        const answer = await prisma.student_answers.create({
            data: {
                questionId,
                studentId,
                chosenAnswer
            }
        });
        
        res.status(201).json({ message: "Answer submitted successfully", answer });
    } catch (error) {
        console.error("Error submitting answer");
    }
}; 

// Get student's answer for a specific Quiz 
const getStudentAnswerForQuiz = async(req, res) => {
    try {
        const { studentId, quizId } = req.params;

        //  Fetch only the student's own answers for the specific Quiz 
        const answers = await prisma.student_answers.findMany({
            where: {
                studentId: parseInt(studentId),
                question: { quizId: parseInt(quizId) }
            },
            include: { question: true },
        });
        
        res.json({ data: answers });
    } catch (error) {
        console.error("Error fetching student answers:",error);
        res.status(500).json({ error: "error fetching student answers"});
    }
};


// Update answer

// delete answer 

module.exports = {
    submitAnswer,
    getStudentAnswerForQuiz
}