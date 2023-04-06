const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!email || !password || !username) {
    return res.status(422).json({
      error: "please add all the fields",
    });
  }

  try {
    const savedUser = await User.findOne({ email });

    if (savedUser) {
      return res.status(422).json({
        error: "user already exists with that email",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedpassword,
      username,
    });

    await user.save();

    return res.status(201).json({
      message: "saved successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({
      error: "please add email or password",
    });
  }
  try {
    const savedUser = await User.findOne({ email });
    if (!savedUser) {
      return res.status(422).json({
        error: "Invalid Email or password",
      });
    }
    const doMatch = await bcrypt.compare(password, savedUser.password);
    if (doMatch) {
      const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
      const { _id, username, email, picture } = savedUser;
      return res.json({
        token,
        user: {
          _id,
          username,
          email,
          picture,
        },
      });
    }
    return res.status(422).json({
      error: "Invalid Email or password",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

router.post("/logout", async (req, res) => {
  try {
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      error: "Server error",
    });
  }
});

module.exports = router;
