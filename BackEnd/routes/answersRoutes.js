const express = require("express");
const router = express.Router();
const { getAnswers , postAnswers, deleteAnswers, updateAnswers } = require("../controllers/answersControllers");

router.post("/postAnswers", postAnswers);
router.get("/getAnswers", getAnswers);
router.delete("/deleteAnswers", deleteAnswers);
router.put("/updateAnswers", updateAnswers);

module.exports = router;