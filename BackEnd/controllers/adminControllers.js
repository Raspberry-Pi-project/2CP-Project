const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcryptjs");

const getAdmin = async (req, res) => {
    try {
      const {
        id_admin
      } = req.body;

      const admin = await prisma.admins.findUnique({
        where: {
          id_admin: id_admin
        },
      });
      
      res.json({
        data: admin,
      });
    } catch (error) {
      res.status(500).json({ error: "Error getting admin" });
    }
  };

  module.exports = {
    getAdmin,
  };