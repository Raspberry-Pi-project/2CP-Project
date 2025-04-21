
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { authenticateUser, authorizeRoles } = require("./middleware/authMiddleware");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger.json");
const app = express();

// Swagger documentation
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
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


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Make sure you have something like this in your app.js or index.js
app.use('/students', studentsRoutes);






