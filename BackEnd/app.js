const express = require("express");
const app = express();
const teachersRoutes = require("./routes/teachersRoutes");

app.use(express.json());
app.use("/teachers", teachersRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
