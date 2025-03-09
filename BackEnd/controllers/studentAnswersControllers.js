const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Submit an answer 
/*const submitAnswer = async(req, res) => {
    try {
        const { questionId, studentId, chosenAnswer } = req.body;

        // Check if the answer already exists to avoid duplicates
        const existingAnswer = await prisma.student_answers.findFirst({
            where: { id_question , id_student }        
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
}; */



const submitAnswer = async (req, res) => {
    const { id_student,id_attempt, id_question, student_answer_text } = req.body;
  console.log(id_student,id_attempt, id_question, student_answer_text)
    try {
      // Check if the attempt is valid and active
      const attempt = await prisma.attempts.findUnique({
        where: { id_attempt }
      });
      if (!attempt) {
        return res.status(404).json({ error: "Attempt not found." });
      }
  
      // Check if the question is valid
      const question = await prisma.questions.findUnique({
        where: { id_question }
      });


      if (!question) {
        return res.status(404).json({ error: "Question not found." });
      }
  
      // Check if the student has already answered this question
      const existingAnswer = await prisma.student_answers.findFirst({
        where: { id_student, id_attempt, id_question }
      });
  
      if (existingAnswer) {
        return res.status(400).json({ error: "You have already submitted an answer for this question." });
      }
    
    const data = []
    student_answer_text.forEach(element => {
      const attempt = {
        id_student,
        id_attempt,
        id_question,
        student_answer_text: element
      }
      data.push(attempt)
    })
      // Create the new answer
      const newAnswer = await prisma.student_answers.createMany({
        data: data
      });
  
      res.status(201).json({ message: "Answer submitted successfully", newAnswer });
    } catch (error) {
      console.error("Error submitting answer:", error);
      res.status(500).json({ error: "Error submitting answer" });
    }
  };



// Get student's answer for a specific Quiz 
const getStudentAnswerForQuiz = async(req, res) => {
    try {
        const { id_student, id_quiz } = req.params;

        //  Fetch only the student's own answers for the specific Quiz 
        const answers = await prisma.student_answers.findMany({
            where: {
                attempts: {
                    id_student: parseInt(id_student),
                    id_quiz: parseInt(id_quiz),
                },
            },
            include: {
                questions: true,
            },
        });
        
        res.json({ data: answers });
    } catch (error) {
        console.error("Error fetching student answers:",error);
        res.status(500).json({ error: "error fetching student answers"});
    }
};


// Update answer

const updateAnswer = async (req, res) => {
    const { id_student_answer } = req.params;
    const { student_answer_text } = req.body;
  
    try {
      // Check if the answer exists
      const existingAnswer = await prisma.student_answers.findUnique({
        where: { id_student_answer: parseInt(id_student_answer) }
      });
  
      if (!existingAnswer) {
        return res.status(404).json({ error: "Answer not found." });
      }
  
      // Update the answer
      const updatedAnswer = await prisma.student_answers.update({
        where: { id_student_answer: parseInt(id_student_answer) },
        data: { student_answer_text }
      });
  
      res.json({ message: "Answer updated successfully", updatedAnswer });
    } catch (error) {
      console.error("Error updating answer:", error);
      res.status(500).json({ error: "Error updating answer" });
    }
  };


// delete answer 

const deleteAnswer = async (req, res) => {
    const { id_student_answer } = req.params;
  
    try {
      // Check if the answer exists
      const existingAnswer = await prisma.student_answers.findUnique({
        where: { id_student_answer: parseInt(id_student_answer) }
      });
  
      if (!existingAnswer) {
        return res.status(404).json({ error: "Answer not found." });
      }
  
      // Delete the answer
      await prisma.student_answers.delete({
        where: { id_student_answer: parseInt(id_student_answer) }
      });
  
      res.json({ message: "Answer deleted successfully" });
    } catch (error) {
      console.error("Error deleting answer:", error);
      res.status(500).json({ error: "Error deleting answer" });
    }
  };
  

  // Get all answers for an attempt 

  const getAnswersByAttempt = async (req, res) => {
    const { id_attempt } = req.params;
  
    try {
      const answers = await prisma.student_answers.findMany({
        where: { id_attempt: parseInt(id_attempt) },
        include: { questions: true }
      });
  
      res.json({ data: answers });
    } catch (error) {
      console.error("Error fetching answers:", error);
      res.status(500).json({ error: "Error fetching answers" });
    }
  };



  // Get details of a specific answer 
  const getAnswerById = async (req, res) => {
    const { id_student_answer } = req.params;
  
    try {
      const answer = await prisma.student_answers.findUnique({
        where: { id_student_answer: parseInt(id_student_answer) },
        include: { questions: true }
      });
  
      if (!answer) {
        return res.status(404).json({ error: "Answer not found." });
      }
  
      res.json({ data: answer });
    } catch (error) {
      console.error("Error fetching answer:", error);
      res.status(500).json({ error: "Error fetching answer" });
    }
  };

module.exports = {
    submitAnswer,
    getStudentAnswerForQuiz,
    updateAnswer,
    deleteAnswer,
    getAnswersByAttempt,
    getAnswerById
}