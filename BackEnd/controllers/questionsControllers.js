const { PrismaClient } = require("@prisma/client"); // Fixed typo
const prisma = new PrismaClient();

// Get All Questions 
const getAllQuestions = async (req, res) => {
    try {
        const questions = await prisma.questions.findMany();
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ error: "Error fetching questions" });
    }
};

// Get a Specific Question by ID
const getQuestionById = async (req, res) => {
    const { id_question } = req.params;
    try {
        const question = await prisma.questions.findUnique({
            where: { id_question: parseInt(id_question) } // Find the question with this ID
        });
        if (!question) return res.status(404).json({ error: "Question not found" }); // Fixed variable name
        res.json(question); // Return question instead of quiz
    } catch (error) {
        console.error("Error fetching question:", error); // Added console error for better debugging
        res.status(500).json({ error: "Error fetching question" });
    }
};

// Create a New Question 
const createQuestion = async (req, res) => { // Fixed typo in async
    const { id_quiz, question_text, question_number, question_type } = req.body;
    try {

         // Validate required fields
         if (!id_quiz || !question_text || !question_number || !question_type) {
            return res.status(400).json({ error: "All fields are required" });
        }


        // Check if the quiz exists
        const quizExists = await prisma.quizzes.findUnique({
            where: { id_quiz: parseInt(id_quiz) }
        });
        
        if (!quizExists) {
            return res.status(400).json({ error: "Quiz not found" });
        }

        // Create the new question 
        const newQuestion = await prisma.questions.create({
            data: {
                id_quiz: parseInt(id_quiz),
                question_text,
                question_number,
                question_type,
                created_at: new Date(),   
            },
        });

        res.status(201).json(newQuestion); // The question has been created successfully
     } catch (error) {
        console.error("Error creating question:", error);
        res.status(500).json({ error: "Error creating question" });
     }
};


// ✅ Get All Questions for a Specific Quiz
const getQuestionsByQuiz = async (req, res) => {
    const { id_quiz } = req.params;

    try {
        const questions = await prisma.questions.findMany({
            where: { id_quiz: parseInt(id_quiz) }
        });

        if (questions.length === 0) {
            return res.status(404).json({ error: "No questions found for this quiz" });
        }

        res.json(questions);
    } catch (error) {
        console.error("Error fetching questions by quiz:", error);
        res.status(500).json({ error: "Error fetching questions by quiz" });
    }
};



// Update a Question 
const updateQuestion = async (req, res) => {
    const { id_question } = req.params;
    const { question_text, question_number, question_type } = req.body;

    try {
        // Check if the question exists 
        const questionExists = await prisma.questions.findUnique({
            where: { id_question: parseInt(id_question) }
        });

        if (!questionExists) {
            return res.status(404).json({ error: "Question not found" });
        }

        // Update the question 
        const updatedQuestion = await prisma.questions.update({
            where: { id_question: parseInt(id_question) },
            data: { question_text, question_number, question_type },
        });

        res.json(updatedQuestion); // The question has been updated successfully
    } catch (error) {
        console.error("Error updating question:", error);
        res.status(500).json({ error: "Error updating question" });
    }
};


// Delete a Question
const deleteQuestion = async (req, res) => {
    const { id_question } = req.params;

    try {
        // Check if the question exists 
        const existingQuestion = await prisma.question.findUnique ({
            where: { id_question: parseInt(id_question) },
        });
        
        res.json({ message: "Question deleted successfully" });
    } catch (error) {
        console.error("Error deleting question:", error);
        res.status(500).json({ error: "Error deleting question" });
    }
};

// Export all controller functions 

module.exports = {
    getAllQuestions,
    getQuestionById,
    createQuestion,
    getQuestionsByQuiz,
    updateQuestion,
    deleteQuestion,
};
