const express = require("express");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/protected", protect, (req, res) => {
  res.status(200).json({
    message: "You have access to this protected route",
    user: req.user
  });
});

module.exports = router;