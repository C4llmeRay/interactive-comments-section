const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User signup
const signup = async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    // Check if the email or username already exists
    const checkUser = await User.findOne({ $or: [{ email }, { username }] });
    if (checkUser) {
      return res.status(400).send({ msg: "Email or username already exists" });
    }

    // Generate a salt and hash the password
    bcrypt.genSalt(10, async (err, salt) => {
      if (err) {
        return res.status(500).send({ msg: "Failed to salt" });
      }

      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(500).send({ msg: "Failed to hash" });
        }

        // Create the user with name, username, email, and hashed password
        const user = { name, username, email, password: hash };
        const createdUser = await User.create(user);

        // Generate and send the JWT token
        const token = jwt.sign({ id: createdUser._id }, "difficultPrivateKey");
        res.send({ token });
      });
    });
  } catch (error) {
    res.status(500).send({ msg: "error" });
  }
};
// User login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (user) {
      // Compare the provided password with the stored hashed password
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          // Passwords match, generate and send the JWT token
          const token = jwt.sign({ id: user._id }, "difficultPrivateKey");
          res.send({ token });
        } else {
          // Passwords don't match
          res.status(401).send({ msg: "Incorrect password" });
        }
      });
    } else {
      // User not found
      res.status(404).send({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Failed to log in" });
  }
};
// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select("-password");
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ msg: "User not found" });
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).send({ msg: "Failed to fetch user profile" });
  }
};
// Update user profile
const updateUserProfile = async (req, res) => {
  const { name, username } = req.body;

  try {
    const user = await User.findOneAndUpdate(
      { _id: req.user.id },
      { name, username },
      { new: true }
    );

    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ msg: "User not found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "Failed to update user profile" });
  }
};


module.exports = {
  signup,
  login,
  getUserProfile,
  updateUserProfile,
}