const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const updateTeacher = async (req, res) => {
  const { id_teacher, first_name, last_name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedTeacher = await prisma.teachers.update({
      where: { id_teacher: id_teacher },
      data: {
        first_name,
        last_name,
        email,
        password: hashedPassword,
      },
    });
    res.json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ error: "Error updating teacher" });
  }
};

const getTeachers = async (req, res) => {
  try {
    const {
      page,
      limit,
      first_name,
      last_name,
      email,
      id_teacher,
      created_at,
    } = req.body;
    const filters = {};
    if (first_name) filters.first_name = { contains: first_name };
    if (last_name) filters.last_name = { contains: last_name };
    if (email) filters.email = { contains: email };
    if (id_teacher) filters.id_teacher = id_teacher;
    if (created_at) filters.created_at = created_at;
    const teachers = await prisma.teachers.findMany({
      skip: (page - 1) * limit, //skip records based on page number
      take: limit, // limit number of teachers per page
      where: filters,
    });
    const totalTeachers = await prisma.teachers.count({
      where: filters,
    });
    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalTeachers / limit),
      data: teachers,
    });
  } catch (error) {
    res.status(500).json({ error: "Error getting teachers" });
  }
};

const deleteTeacher = async (req, res) => {
  try {
    const { id_teacher } = req.body;
    const deletedTeacher = await prisma.teachers.delete({
      where: { id_teacher },
    });
    res.json(deletedTeacher);
  } catch (error) {
    res.status(500).json({ error: "Error deleting teacher" });
  }
};


module.exports = {
  getTeachers,
  deleteTeacher,
  updateTeacher
};
