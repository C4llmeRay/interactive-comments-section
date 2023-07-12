const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.header("Authorization").replace("Bearer ", "");

    // Verify the token
    const decoded = jwt.verify(token, "difficultPrivateKey");

    // Find the user by ID
    const user = await User.findOne({ _id: decoded.id });

    if (!user) {
      throw new Error();
    }

    // Set the user object in req.user
    req.user = user;

    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    res.status(401).send({ msg: "Authentication failed" });
  }
};

module.exports = authMiddleware;

