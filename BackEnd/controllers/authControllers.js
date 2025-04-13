const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const dotenv = require("dotenv");
dotenv.config();

const generateToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};

// ✅ Register User (Students, Teachers, Admins)
const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password, role , groupe_student , annee } = req.body;

        // Check if email already exists in any user table
        let existingUser = await prisma.students.findUnique({ where: { email } }) ||
                           await prisma.teachers.findUnique({ where: { email } }) ||
                           await prisma.admins.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        let newUser;
        if (role === "student") {
            newUser = await prisma.students.create({
                data: { first_name, last_name, email, password: hashedPassword, annee: 1, groupe_student: 1 , groupe_student , annee }
            });
        } else if (role === "teacher") {
            newUser = await prisma.teachers.create({
                data: { first_name, last_name, email, password: hashedPassword }
            });
        } else if (role === "admin") {
            newUser = await prisma.admins.create({
                data: { first_name, last_name, email, password: hashedPassword }
            });
        } else {
            return res.status(400).json({ message: "Invalid role specified" });
        }


        res.status(201).json({ message: "Registration successful", newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// ✅ Login User and Set Token in Cookie
const login = async (req, res) => {
    const { email, password, role } = req.body;
    
    
    let user;
    if (role === "student") {
        
        user = await prisma.students.findUnique({ where: { email } });
        
    } else if (role === "teacher") {
        user = await prisma.teachers.findUnique({ where: { email } });
        
    } else if (role === "admin") {
        user = await prisma.admins.findUnique({ where: { email } });
    } else {
        return res.status(400).json({ message: "Invalid role." });
    }

    if (!user) return res.status(404).json({ message: "User not found." });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = generateToken({ id: user.id, role });

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    switch (role) {
        case "student":
            res.json({ role, userId: user.id_student, message: "Login successful" });
            break;
        case "teacher":
            res.json({ role, userId: user.id_teacher, message: "Login successful" });
            break;
        case "admin":
            res.json({ role, userId: user.id_admin, message: "Login successful" });
            break;
    }
    console.log(res.json);
};

// ✅ Logout User by Clearing Cookie
const logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "Strict" });
    res.json({ message: "Logged out successfully" });
};

module.exports = { login, logout , register };
