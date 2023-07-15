const Comment = require("../models/comment.js");
const Notification = require("../models/notification");


// Get all comments
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate({
      path: "userId",
      select: "username",
    }).populate({
      path: "replies.userId",
      select: "username",
    });
    res.send(comments);
  } catch (error) {
    res.status(500).send({ msg: "Failed to fetch comments" });
  }
};
// Get a single comment by ID
const getOneComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id });
    if (comment) {
      res.send(comment);
    } else {
      res.status(404).send({ msg: "Comment not found" });
    }
  } catch (error) {
    console.error("Error fetching comment:", error);
    res.status(500).send({ msg: "Failed to fetch comment" });
  }
};
// Create a new comment
const postOneComment = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.id; // Retrieve the user ID from the authenticated request
    const newComment = await Comment.create({ content, userId });
    res.send({ msg: "Comment posted successfully", comment: newComment });

  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).send({ msg: "Failed to create comment" });
  }
};
// Delete a comment by ID
const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.deleteOne({ _id: req.params.id });
    if (deletedComment.deletedCount > 0) {
      res.send({ msg: "Comment deleted successfully" });
    } else {
      res.status(404).send({ msg: "Comment not found" });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).send({ msg: "Failed to delete comment" });
  }
};
// Edit a comment by ID
const editComment = async (req, res) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (updatedComment) {
      res.send({ msg: "Comment edited successfully" });
    } else {
      res.status(404).send({ msg: "Comment not found" });
    }
  } catch (error) {
    console.error("Error editing comment:", error);
    res.status(500).send({ msg: "Failed to edit comment" });
  }
};
// Get all comments for a specific user
const getAllUserComments = async (req, res) => {
  try {
    const userId = req.user.id; // Retrieve the user ID from the authenticated request
    const userComments = await Comment.find({ userId });
    res.send(userComments);
  } catch (error) {
    console.error("Error fetching user comments:", error);
    res.status(500).send({ msg: "Failed to fetch user comments" });
  }
};
// Post a reply to a comment
const postReply = async (req, res) => {
  const { content } = req.body;
  const userId = req.user.id; // Get the user ID from the authenticated user

  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).send({ msg: "Comment not found" });
    }

    const reply = {
      content,
      userId,
      createdAt: new Date(),
    };

    comment.replies.push(reply);
    await comment.save();

    // Create notification for the comment owner
    const notification = new Notification({
      userId: comment.userId, // Comment owner's user ID
      type: "reply",
      commentId: comment._id,
    });

    await notification.save();

    res.send({ msg: "Reply posted successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Failed to post reply" });
  }
};

const deleteReply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).send({ msg: "Comment not found" });
    }

    const replyIndex = comment.replies.findIndex(reply => reply._id.toString() === req.params.replyId);

    if (replyIndex === -1) {
      return res.status(404).send({ msg: "Reply not found" });
    }

    comment.replies.splice(replyIndex, 1); // Remove the reply from the replies array
    await comment.save();

    res.send({ msg: "Reply deleted successfully" });
  } catch (error) {
    console.error("Error deleting reply:", error);
    res.status(500).send({ msg: "Failed to delete reply" });
  }
};

const editReply = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).send({ msg: "Comment not found" });
    }

    const reply = comment.replies.id(req.params.replyId);

    if (!reply) {
      return res.status(404).send({ msg: "Reply not found" });
    }

    reply.content = req.body.content; // Update the content of the reply
    await comment.save();

    res.send({ msg: "Reply edited successfully" });
  } catch (error) {
    console.error("Error editing reply:", error);
    res.status(500).send({ msg: "Failed to edit reply" });
  }
};

// Like a comment
const likeComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.id;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send({ msg: "Comment not found" });
    }

    const existingLikeIndex = comment.likes.findIndex((like) => like.userId === userId);

    if (existingLikeIndex > -1) {
      // User already liked the comment, remove the like
      comment.likes.splice(existingLikeIndex, 1);
    } else {
      const existingDislikeIndex = comment.dislikes.findIndex((dislike) => dislike.userId === userId);
      if (existingDislikeIndex > -1) {
        // User disliked the comment, remove the dislike
        comment.dislikes.splice(existingDislikeIndex, 1);
      }

      // User has not liked the comment, add the like
      comment.likes.push({ userId });

      // Create notification for the comment owner
      const notification = new Notification({
        userId: comment.userId,
        type: "like",
        commentId: comment._id,
      });

      await notification.save();
    }

    await comment.save();
    res.send(comment);
  } catch (error) {
    console.error("Error liking comment:", error);
    res.status(500).send({ msg: "Failed to like comment" });
  }
};

// Dislike a comment
const dislikeComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user.id;

  try {
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send({ msg: "Comment not found" });
    }

    const existingDislikeIndex = comment.dislikes.findIndex((dislike) => dislike.userId === userId);

    if (existingDislikeIndex > -1) {
      // User already disliked the comment, remove the dislike
      comment.dislikes.splice(existingDislikeIndex, 1);
    } else {
      const existingLikeIndex = comment.likes.findIndex((like) => like.userId === userId);
      if (existingLikeIndex > -1) {
        // User liked the comment, remove the like
        comment.likes.splice(existingLikeIndex, 1);
      }

      // User has not disliked the comment, add the dislike
      comment.dislikes.push({ userId });

      // Create notification for the comment owner
      const notification = new Notification({
        userId: comment.userId,
        type: "dislike",
        commentId: comment._id,
      });

      await notification.save();
    }

    await comment.save();
    res.send(comment);
  } catch (error) {
    console.error("Error disliking comment:", error);
    res.status(500).send({ msg: "Failed to dislike comment" });
  }
};





module.exports = {
  getAllComments,
  getOneComment,
  postOneComment,
  deleteComment,
  editComment,
  getAllUserComments,
  postReply,
  deleteReply,
  editReply,
  likeComment,
  dislikeComment,
};

