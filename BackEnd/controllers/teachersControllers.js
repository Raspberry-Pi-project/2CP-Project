const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createTeacher = async (req, res) => {
  try {
    console.log(req.body);
    const { first_name, last_name, email, password, id_groupe } = req.body;
    console.log(id_groupe, first_name, last_name, email, password);
    const newTeacher = await prisma.teachers.create({
      data: { first_name, last_name, email, password, id_groupe },
    });

    res.json(newTeacher);
  } catch (error) {
    res.status(500).json({ error: "Error creating teacher" });
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

const deleteTeachersGroupe = async (req, res) => {
  try {
    const deletedTeachers = await prisma.teachers.deleteMany({
      where: { id_groupe: req.body.id_groupe },
    });
    res.json(deletedTeachers);
  } catch (error) {
    res.status(500).json({ error: "Error deleting teachers" });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const { id_teacher, first_name, last_name, email, password, id_groupe } =
      req.body;
    const data = {};
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;
    if (email) data.email = email;
    if (password) data.password = password;
    if (id_groupe) data.id_groupe = id_groupe;
    const updatedTeacher = await prisma.teachers.update({
      where: { id_teacher },
      data: data,
    });
    res.json(updatedTeacher);
  } catch (error) {
    res.status(500).json({ error: "Error updating teacher" });
  }
};

const changeTeachersGroupe = async (req, res) => {
  try {
    const { id_groupe, newGroupe } = req.body;
    const data = {};
    if (newGroupe) data.id_groupe = newGroupe;
    console.log ( id_groupe , data)
    const updatedTeachers = await prisma.teachers.updateMany({
      where: { id_groupe : id_groupe },
      data: data,
    });

    res.json(updatedTeachers);
  } catch (error) {
    res.status(500).json({ error: "Error updating teachers Groupe" });
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  deleteTeacher,
  deleteTeachersGroupe,
  changeTeachersGroupe,
  updateTeacher,
};
