import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAllComments,
  addComment,
  deleteComment,
  editComment,
  addReply,
  deleteReply,
  editReply
} from '../api';

function CommentSection() {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchComments();
    }
  }, [navigate]);

  const fetchComments = () => {
    getAllComments()
      .then((response) => {
        console.log('Comments response:', response);
        setComments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleReplyChange = (event) => {
    setNewReply(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.trim() === '') return;

    const commentData = {
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    addComment(commentData)
      .then(() => {
        console.log('Comment added successfully');
        setNewComment('');
        fetchComments();
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  const handleCommentDelete = (commentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (confirmDelete) {
      deleteComment(commentId)
        .then(() => {
          console.log('Comment deleted successfully');
          fetchComments();
        })
        .catch((error) => {
          console.error('Error deleting comment:', error);
        });
    }
  };

  const handleCommentEdit = (commentId, updatedContent) => {
    if (updatedContent.trim() === '') return;

    editComment(commentId, { content: updatedContent })
      .then(() => {
        console.log('Comment updated successfully');
        fetchComments();
      })
      .catch((error) => {
        console.error('Error updating comment:', error);
      });
  };

  const handleReplySubmit = (commentId) => {
    if (newReply.trim() === '') return;

    const replyData = {
      content: newReply,
      createdAt: new Date().toISOString(),
    };

    addReply(commentId, replyData)
      .then(() => {
        console.log('Reply added successfully');
        setNewReply(''); // Clear the reply input
        fetchComments();
      })
      .catch((error) => {
        console.error('Error adding reply:', error);
      });
  };

  const handleReplyDelete = (commentId, replyId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this reply?');
    if (confirmDelete)
    deleteReply(commentId, replyId)
      .then(() => {
        console.log('Reply deleted successfully');
        fetchComments();
      })
      .catch((error) => {
        console.error('Error deleting reply:', error);
      });
  };

  const handleReplyEdit = (commentId, replyId, updatedContent) => {
    if (updatedContent.trim() === '') return;

    editReply(commentId, replyId, { content: updatedContent })
      .then(() => {
        console.log('Reply updated successfully');
        fetchComments();
      })
      .catch((error) => {
        console.error('Error updating reply:', error);
      });
  };

  function disconnect() {
    localStorage.removeItem('token');
    navigate('/');
  }

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="comments-container">
      <div className="header">
        <h2>Comments</h2>
        <button className="disconnect-btn" onClick={disconnect}>
          Disconnect
        </button>
      </div>

      <form onSubmit={handleCommentSubmit}>
        <textarea
          name="newComment"
          placeholder="Add a comment..."
          value={newComment}
          onChange={handleCommentChange}
          className="comments"
        />
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>

      {comments.map((comment) => (
        <div key={comment._id} className="comment-item">
          <div className="user-date-container">
            <p>{comment.userId ? comment.userId.username : 'No user found'}</p>
            <p>{formatDateTime(comment.createdAt)}</p>
          </div>
          <p className="comment">{comment.content}</p>

          <div className="buttons">
            <button
              className="edit-btn"
              onClick={() => {
                const updatedContent = prompt('Enter the updated comment content:');
                handleCommentEdit(comment._id, updatedContent);
              }}
            >
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => handleCommentDelete(comment._id)}
            >
              Delete
            </button>
          </div>

          <form
        className="reply-form"
        onSubmit={(event) => {
          event.preventDefault();
          handleReplySubmit(comment._id);
        }}
      >
        <textarea
          className="reply-comment"
          placeholder="Write a reply..."
          value={newReply}
          onChange={handleReplyChange}
        />
        <button className="reply-btn" type="submit">
          Reply
        </button>
      </form>

          {comment.replies &&
            comment.replies.map((reply) => (
              <div key={reply._id} className="reply-item">
                <div className="user-date-container">
                  <p>{reply.userId ? reply.userId.username : 'No user found'}</p>
                  <p>{formatDateTime(reply.createdAt)}</p>
                </div>
                <p className="comment">{reply.content}</p>
                <div className="buttons">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      const updatedContent = prompt('Enter the updated reply content:');
                      handleReplyEdit(comment._id, reply._id, updatedContent);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleReplyDelete(comment._id, reply._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default CommentSection;
