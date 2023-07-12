const router = require("express").Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all comments
router.get("/", commentController.getAllComments);
// Get a single comment by ID
router.get("/:id", commentController.getOneComment);
// Create a new comment
router.post("/", authMiddleware, commentController.postOneComment); 
// Delete a comment by ID
router.delete("/:id", authMiddleware, commentController.deleteComment);
// Edit a comment by ID
router.put("/:id", authMiddleware, commentController.editComment);
// Get all comments for a specific user
router.get("/user/:userId", commentController.getAllUserComments);
// Post a reply to a comment
router.post("/:commentId/reply", authMiddleware, commentController.postReply);
// Delete a reply
router.delete("/:commentId/reply/:replyId", authMiddleware, commentController.deleteReply);
// Edit a reply
router.put("/:commentId/reply/:replyId", authMiddleware, commentController.editReply);

module.exports = router;



