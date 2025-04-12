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
        const { firstName, lastName, email, password, role, groupe, year } = req.body;
        console.log("Received registration request:", req.body);
        // Check if email already exists in any user table
        let existingUser = await prisma.students.findUnique({ where: { email } }) ||
                           await prisma.teachers.findUnique({ where: { email } }) ||
                           await prisma.admins.findUnique({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Hashed password:", hashedPassword);
        let newUser;
        if (role === "student") {
            newUser = await prisma.students.create({
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    email,
                    password: hashedPassword,
                    annee: year || 1,
                    groupe_student: groupe || 1
                }
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
    
    //console.log("Received login request:", req.body);
    let user;
    if (role === "student") {

        user = await prisma.students.findUnique({ where: { email } });
        
    } else if (role === "teacher") {
        user = await prisma.teachers.findUnique({ where: { email } });
    } else if (role === "admin") {
        user = await prisma.admins.findUnique({ where: { email } });
        console.log("Admin user:", user);
    } else {
        return res.status(400).json({ message: "Invalid role." });
    }

    if (!user) return res.status(404).json({ message: "User not found." });
    
    const isMatch = await bcrypt.compare(password, user.password);
    //const isMatch = true;
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = generateToken({ id: user.id, role });
    //console.log("Generated token:", token);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });
    console.log("Fetched user:", user);
    let id = role === "student" ? user.id_student : role === "teacher" ? user.id_teacher: user.id_admin ;
    console.log({role, userId: id, message: "Login successful", token: token });
    res.json({ role, userId: id, message: "Login successful", token: token });
};

// ✅ Logout User by Clearing Cookie
const logout = (req, res) => {
    res.clearCookie("token", { httpOnly: true, sameSite: "Strict" });
    res.json({ message: "Logged out successfully" });
};

module.exports = { login, logout , register };
