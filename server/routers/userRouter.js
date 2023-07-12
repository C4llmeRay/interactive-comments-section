const router = require("express").Router();
const userController = require("../controllers/userController.js");
const authMiddleware = require("../middleware/authMiddleware.js");


router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.get("/profile", authMiddleware, userController.getUserProfile);
router.put("/profile", authMiddleware, userController.updateUserProfile);

module.exports = router;
