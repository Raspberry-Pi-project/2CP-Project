const { PrismaClient } = require("@prisma/client"); // Fixed typo
const prisma = new PrismaClient();


const calculatePercentage = async (req, res) => {
    const { id_quiz  } = req.body;
    try {
        console.log("getPercentage")
        const allQuestions = await prisma.questions.findMany({
            where: {
                id_quiz: id_quiz
            },
            include: {
                student_answers: {
                    select : {
                        correct: true
                    }
                }  
            }
        })
        
        allQuestions.forEach(async (question) =>  {
            let correctAnswers = 0
            const numberOfAnswers = question.student_answers.length || 1
            question.student_answers.forEach(answer => {
                if (answer.correct) {
                    correctAnswers++;
                }
            })
            question.question_percentage = (correctAnswers / numberOfAnswers) * 100
            const updatedQuestion = await prisma.questions.update({
                where: {
                    id_question: question.id_question
                },
                data: {
                    question_percentage: question.question_percentage
                }
            })
            console.log(updatedQuestion)
        })

        
        
        res.json(allQuestions)
    } catch (error) {
        res.status(500).json({ error: "Error getting percntages" });
    
    }
}




// Export all controller functions 

module.exports = {
    calculatePercentage
   
};
