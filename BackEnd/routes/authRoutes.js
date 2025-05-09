const express = require("express");
const { login, logout , register } = require("../controllers/authControllers");
const { authenticateUser, authorizeRoles } = require("../middleware/authMiddleware");


const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/register"/*,authenticateUser, authorizeRoles("admin") */,  register);

module.exports = router;
