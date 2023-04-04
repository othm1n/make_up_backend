const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const User = mongoose.model("User");

router.get("/user", requireLogin, async (req, res) => {
  try {
    const { _id } = req.user;
    const user = await User.findOne({ _id }).select("-password").populate({
      path: "cart.product",
      select: "-__v",
    });
    res.json(user?.toJSON());
  } catch (error) {
    res.status(404).json({
      error: "User not found",
    });
  }
});

module.exports = router;
