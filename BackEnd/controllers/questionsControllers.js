const { PrismaClient } = require("@prisma/client"); // Fixed typo
const prisma = new PrismaClient();

const calculatePercentage = async (req, res) => {
  const { id_quiz } = req.body;
  try {
    console.log("getPercentage");
    const allQuestions = await prisma.questions.findMany({
      where: {
        id_quiz: id_quiz,
      },
      include: {
        student_answers: {
          select: {
            correct: true,
            id_attempt: true,
          },
        },
      },
    });

    allQuestions.forEach(async (question) => {
      let correctAnswers = 0;
      let QuestionCorrectAnswers = 0;
      const groupedAnswers = question.student_answers.length === 0 ? [] : question.student_answers.reduce((acc, obj) => {
        const foundGroup = acc.find(
          (group) => group[0].id_attempt === obj.id_attempt
        );
        if (foundGroup) {
          foundGroup.push(obj);
        } else {
          acc.push([obj]);
        }
        return acc;
      }, []);
      const numberOfAnswers = groupedAnswers.length
      
      if (numberOfAnswers !== 0){
      groupedAnswers.forEach((answer) => {
        answer.forEach((answer) => {
          if (answer.correct) {
            QuestionCorrectAnswers++;
          }
        });
        if (QuestionCorrectAnswers === answer.length && answer.length > 0) {
          correctAnswers++;
          QuestionCorrectAnswers = 0;
        }
      });}
      question.question_percentage = numberOfAnswers === 0 ? 0 : (correctAnswers / numberOfAnswers) * 100;
      
      const updatedQuestion = await prisma.questions.update({
        where: {
          id_question: question.id_question,
        },
        data: {
          question_percentage: question.question_percentage,
        },
      });
      //console.log(updatedQuestion)
    });

    res.json(allQuestions);
  } catch (error) {
    res.status(500).json({ error: "Error getting percntages" });
  }
};

// Export all controller functions

module.exports = {
  calculatePercentage,
};
