const express = require("express");
const app = express();
const teachersRoutes = require("./routes/teachersRoutes");
const studentsRoutes = require("./routes/studentsRoutes");
const questionsRoutes = require("./routes/questionsRoutes");
const quizRoutes = require("./routes/quizRoutes");
const studentAnswersRoutes = require("./routes/studentAnswersRoutes");
const attemptsRoutes = require("./routes/attemptsRoutes");


app.use(express.json());
app.use("/teachers", teachersRoutes);

app.use("/students", studentsRoutes);

app.use("/quiz", quizRoutes);

app.use("/questions", questionsRoutes);

app.use("/studentAnswers", studentAnswersRoutes);
 

app.use("/attempts", attemptsRoutes);


app.get("/", (req,res) => {
    res.send("API is running...");
});


const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));





