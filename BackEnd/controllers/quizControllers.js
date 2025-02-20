const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// 🟢 **GET a certain number of quizzes (for pagination)**
const getQuizzes = async (req, res) => {
    
    try {
        const { page, limit, id_quiz, title, id_teacher, created_at, subject } = req.body;
        console.log( "hhhhhhhhhhh")
        //default to page 1
         // default to 10 quizzes per page
        const filters = {};
        if (id_quiz) filters.id_quiz = id_quiz;
        if (title) filters.title = { contains: title, mode: "insensitive" };
        if (id_teacher) filters.id_teacher = id_teacher;
        if (created_at) filters.created_at = created_at;
        if (subject) filters.subject = { contains: subject, mode: "insensitive" }; //filter by subject ;
        
    const quizzes = await prisma.quizzes.findMany({
      skip: (page - 1) * limit, //skip records based on page number
      take: limit, // limit number of quizzes per page
      where: filters,
    });
    const totalQuizzes = await prisma.quizzes.count({
      where: filters});
        
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
    const { title, description, id_teacher, subject } = req.body;
    console.log(title, description, id_teacher, subject,req.body)
    const newQuiz = await prisma.quizzes.create({
      data: { title, description, id_teacher, subject },
    });
    res.json(newQuiz);
  } catch (error) {
    res.status(500).json({ error: "Error creating quiz" });
  }
};

module.exports = { getQuizzes, createQuiz };
