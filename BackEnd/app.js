const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const {
  authenticateUser,
  authorizeRoles,
} = require("./middleware/authMiddleware");
const app = express();
const authRoutes = require("./routes/authRoutes");
const teachersRoutes = require("./routes/teachersRoutes");
const studentsRoutes = require("./routes/studentsRoutes");
const adminsRoutes = require("./routes/adminsRoutes");
// Load environment variables from .env file
require("dotenv").config();

// ✅ Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: function (origin, callback) {
      callback(null, true); // Allow all origins
    },
    credentials: true,
  })
);

// ✅ Routes
app.get("/testConnection", (req, res) => {
  res.json({ message: "Connection successful" });
  res.status(200);
});

app.use("/auth", authRoutes);
app.use("/admins", authenticateUser, authorizeRoles("admin"), adminsRoutes);
app.use(
  "/teachers",
  authenticateUser,
  authorizeRoles("teacher", "admin"),
  teachersRoutes
);
app.use(
  "/students",
  authenticateUser,
  authorizeRoles("student"),
  studentsRoutes
);

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);
