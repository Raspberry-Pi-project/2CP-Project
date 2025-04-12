const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


  const getAllResults = async (req, res) => {
    const { id_quiz , page , limit } = req.body;
    try {
      const allResults = await prisma.attempts.findMany({
        skip: (page - 1) * limit, //skip records based on page number
        take: limit, // limit number of attempts per page
        where: {
            id_quiz: id_quiz
        },
        select: {
            id_attempt: true,
            score: true,
            students: {
                select: {
                    id_student: true,
                    first_name: true,
                    last_name: true
                }
            },
            
        }
    });
    const totalResults = await prisma.attempts.count({
        where: {
            id_quiz: id_quiz
        }
    });
    

      for (const attempt of allResults) {
        const answers = await prisma.student_answers.findMany({
            where: {
                id_attempt: attempt.id_attempt
            },
           
        });
        answers.sort((a, b) => a.id_question - b.id_question);
        attempt.answers = answers
      }
      
      res.json({
        page,
        limit,
        totalPages: Math.ceil(totalResults / limit),
        data: allResults
    });
        
      
    } catch (error) {
        console.error("Error fetching answers:", error);
        res.status(500).json({ error: "Error fetching answers" });
    }
};


module.exports = {
    getAllResults
}