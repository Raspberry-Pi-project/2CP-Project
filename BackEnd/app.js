
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { authenticateUser, authorizeRoles } = require("./middleware/authMiddleware");
const app = express();
const authRoutes = require("./routes/authRoutes");
const teachersRoutes = require("./routes/teachersRoutes");
const studentsRoutes = require("./routes/studentsRoutes");
const adminsRoutes = require("./routes/adminsRoutes");


// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        callback(null, true); // Allow all origins
    },
    credentials: true
}));

// ✅ Routes
app.use("/auth", authRoutes);

app.use("/admins",authenticateUser, authorizeRoles("admin"), adminsRoutes);
app.use("/teachers",authenticateUser, authorizeRoles("teacher" , "admin"), teachersRoutes);
app.use("/students",authenticateUser, authorizeRoles("student"), studentsRoutes);






app.get("/", (req,res) => {
    res.send("API is running...");
});


const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






