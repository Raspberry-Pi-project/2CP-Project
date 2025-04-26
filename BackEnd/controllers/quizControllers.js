const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🟢 **GET a certain number of quizzes (for pagination)**
const getQuizzes = async (req, res) => {
  try {
    const {
      page,
      limit,
      id_quiz,
      title,
      id_teacher,
      created_at,
      subject,
      status,
      for_year,
      for_groupe,
      correctionType,
    } = req.body;
    //default to page 1
    // default to 10 quizzes per page
    const filters = {};
    if (correctionType) filters.correctionType = correctionType;
    if (id_quiz) filters.id_quiz = id_quiz;
    if (title) filters.title = { contains: title };
    if (id_teacher) filters.id_teacher = id_teacher;
    if (created_at) filters.created_at = created_at;
    if (subject) filters.subject = { contains: subject, mode: "insensitive" }; //filter by subject ;
    if (status) filters.status = status;
    if (for_year) filters.for_year = for_year;
    if (for_groupe) filters.for_groupe = for_groupe;
    const quizzes = await prisma.quizzes.findMany({
      skip: (page - 1) * limit, //skip records based on page number
      take: limit, // limit number of quizzes per page
      where: filters,
    });
    const totalQuizzes = await prisma.quizzes.count({
      where: filters,
    });
    for (quiz of quizzes) {
      const totalQuestions = await prisma.questions.count({
        where: { id_quiz: quiz.id_quiz },
      });
      quiz.totalQuestions = totalQuestions;
    }

    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalQuizzes / limit),
      data: quizzes,
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching quizzes" });
  }
};

const createQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      id_teacher,
      subject,
      nb_attempts,
      duration,
      correctionType,
      score,
      for_year,
      for_groupe,
      status,
      questions,
      image,
      navigation,
    } = req.body;
    console.log(req.body);
    let for_year2 = for_year;
    let for_groupe2 = for_groupe;
    if (typeof for_year2 === "string") {
      for_year2 = 0;
    }
    if (typeof for_groupe2 === "string") {
      for_groupe2 = 0;
    }
    const newQuiz = await prisma.quizzes.create({
      data: {
        image,
        title,
        description,
        id_teacher,
        subject,
        nb_attempts,
        duration,
        correctionType,
        score,
        for_year: for_year2,
        for_groupe: for_groupe2,
        navigation,
        status, // Save the status
        questions: {
          create: questions.map((question) => ({
            duration: question.duration,
            question_text: question.question_text,
            question_number: question.question_number,
            question_type: question.question_type,
            points: question.points,
            answers: {
              create: question.answers.map((answer) => ({
                answer_text: answer.answer_text,
                correct: answer.correct,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    res.json({ newQuiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Error creating quiz" });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const {
      image,
      id_quiz,
      title,
      description,
      id_teacher,
      subject,
      nb_attempts,
      duration,
      correctionType,
      score,
      for_year,
      for_groupe,
      status,
      questions,
      navigation,
    } = req.body;

    // Update the quiz
    const updatedQuiz = await prisma.quizzes.update({
      where: {
        id_quiz: id_quiz,
      },
      data: {
        image,
        title,
        description,
        id_teacher,
        subject,
        nb_attempts,
        duration,
        correctionType,
        score,
        for_year,
        for_groupe,
        status,
        navigation,
      },
    });

    if (questions.length > 0) {
      // Delete questions marked as deleted
      await prisma.questions.deleteMany({
        where: {
          id_question: {
            in: questions
              .filter((question) => question.deleted === true)
              .map((question) => question.id_question),
          },
        },
      });

      // Process each question
      for (const question of questions) {
        if (question.deleted === false) {
          let updatedQuestion;

          // Update or create the question
          if (question.updated === true) {
            updatedQuestion = await prisma.questions.upsert({
              where: {
                id_question: question.id_question,
              },
              update: {
                duration: question.duration,
                question_text: question.question_text,
                question_number: question.question_number,
                question_type: question.question_type,
                points: question.points,
              },
              create: {
                id_quiz: updatedQuiz.id_quiz,
                duration: question.duration,
                question_text: question.question_text,
                question_number: question.question_number,
                question_type: question.question_type,
                points: question.points,
              },
            });

            // Delete answers marked as deleted
            await prisma.answers.deleteMany({
              where: {
                id_answer: {
                  in: question.answers
                    .filter((answer) => answer.deleted === true)
                    .map((answer) => answer.id_answer),
                },
              },
            });

            // Process each answer
            for (const answer of question.answers) {
              if (answer.deleted === false && answer.updated === true) {
                await prisma.answers.upsert({
                  where: {
                    id_answer: answer.id_answer,
                  },
                  update: {
                    answer_text: answer.answer_text,
                    correct: answer.correct,
                  },
                  create: {
                    id_question: updatedQuestion.id_question,
                    answer_text: answer.answer_text,
                    correct: answer.correct,
                  },
                });
              }
            }
          }
        }
      }
    }

    // Fetch the updated quiz with questions and answers
    const finalQuiz = await prisma.quizzes.findUnique({
      where: {
        id_quiz: updatedQuiz.id_quiz,
      },
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });

    res.json({ quiz: finalQuiz, message: "Quiz updated successfully" });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Error creating quiz" });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id_quiz } = req.body;

    const deletedQuiz = await prisma.quizzes.delete({
      where: {
        id_quiz: id_quiz,
      },
    });
    res.json(deletedQuiz);
  } catch (error) {
    res.status(500).json({ error: "Error deleting quiz" });
  }
};

const getQuizDetails = async (req, res) => {
  const { id_quiz } = req.body;
  try {
    const quiz = await prisma.quizzes.findUnique({
      where: { id_quiz: id_quiz },
      include: {
        questions: {
          select: {
            id_question: true,
            question_text: true,
            question_type: true,
            question_number: true,
            duration: true,
            points: true,
            question_percentage: true,
            answers: {
              select: {
                id_answer: true,
                answer_text: true,
                correct: true,
              },
            },
          },
        },
      },
    });
    console.log("quiz", quiz);
    if (!quiz) return res.status(404).json({ error: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: "Error fetching quiz details" });
  }
};

module.exports = {
  getQuizzes,
  createQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizDetails,
};
