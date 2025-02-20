const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createTeacher = async (req, res) => {
    try {
        console.log(req.body)
        const { first_name, last_name, email, password , id_groupe } = req.body;
        console.log(id_groupe, first_name, last_name, email, password)
        const newTeacher = await prisma.teachers.create({
            data: { first_name, last_name, email, password, id_groupe },
        });
        
        res.json(newTeacher);
    } catch (error) {
        res.status(500).json({ error: "Error creating teacher" });
    }
};

module.exports = { createTeacher };