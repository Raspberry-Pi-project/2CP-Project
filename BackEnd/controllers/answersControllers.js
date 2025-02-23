const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getAnswers = async (req, res) => {
  try {
    const {
      page,
      limit,
      id_answer,
      id_question,
      correct,
      points,
      answer_text,
    } = req.body;
    const filters = {};
    if (id_answer) filters.id_answer = id_answer;
    if (id_question) filters.id_question = id_question;
    if (answer_text) filters.answer_text = { contains: answer_text };
    if (correct) filters.correct = correct;
    if (points) filters.points = points;
    const answers = await prisma.answers.findMany({
      skip: (page - 1) * limit, //skip records based on page number
      take: limit, // limit number of answers per page
      where: filters,
    });
    res.json(answers);
  } catch (error) {
    res.status(500).json({ error: "Error getting answers" });
  }
};

const postAnswers = async (req, res) => {
  try {
    const { id_question, correct, points, answer_text } = req.body;
    const data = {};
    if (answer_text) data.answer_text = answer_text;
    if (correct) data.correct = correct;
    if (points) data.points = points;

    const newAnswer = await prisma.answers.create({
      data: { id_question, correct, points, answer_text },
    });
    res.json(newAnswer);
  } catch (error) {
    res.status(500).json({ error: "Error creating answer" });
  }
};

const deleteAnswers = async (req, res) => {
  try {
    const { id_answer } = req.body;
    const deletedAnswer = await prisma.answers.delete({
      where: { id_answer },
    });
    res.json(deletedAnswer);
  } catch (error) {
    res.status(500).json({ error: "Error deleting answer" });
  }
};

const updateAnswers = async (req, res) => {
  try {
    const { id_answer, id_question,  answer_text, correct, points } = req.body;
    const data = {};
    if (answer_text) data.answer_text = answer_text;
    if (correct) data.correct = correct;
    if (points) data.points = points;
    if (id_question) data.id_question = id_question;
    const updatedAnswer = await prisma.answers.update({
      where: { id_answer },
      data: data,
    });
    res.json(updatedAnswer);
  } catch (error) {
    res.status(500).json({ error: "Error updating answer" });
  }
};

module.exports = {
  getAnswers,
  postAnswers,
  deleteAnswers,
  updateAnswers,
};
