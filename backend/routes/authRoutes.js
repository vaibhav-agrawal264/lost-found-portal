const express = require("express");
const router = express.Router();

const { registerUser,loginUser,logoutUser } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/check", authMiddleware, (req, res) => {
  res.json({
    authenticated: true,
    userId: req.user.id
  });
});
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;