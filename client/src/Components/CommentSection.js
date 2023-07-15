import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import {
  getAllComments,
  addComment,
  deleteComment,
  editComment,
  addReply,
  deleteReply,
  editReply,
  likeComment,
  dislikeComment,
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
      likes: [],
      dislikes: [],
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
        setNewReply('');
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

  const handleLikeComment = (commentId) => {
    likeComment(commentId)
      .then((response) => {
        const updatedComments = comments.map((comment) => {
          if (comment._id === commentId) {
            return response.data;
          }
          return comment;
        });
        setComments(updatedComments);
      })
      .catch((error) => {
        console.error('Error liking comment:', error);
      });
  };

  const handleDislikeComment = (commentId) => {
    dislikeComment(commentId)
      .then((response) => {
        const updatedComments = comments.map((comment) => {
          if (comment._id === commentId) {
            return response.data;
          }
          return comment;
        });
        setComments(updatedComments);
      })
      .catch((error) => {
        console.error('Error disliking comment:', error);
      });
  };

  const handleShowAllReplies = (commentId) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment._id === commentId) {
          return { ...comment, showAllReplies: true };
        }
        return comment;
      });
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
        <h2 className="comments-title">Comments</h2>
        <button className="disconnect-btn" onClick={disconnect}>
          Disconnect
        </button>
      </div>

      <form onSubmit={handleCommentSubmit} className="comment-form">
        <textarea
          name="newComment"
          placeholder="Add a comment..."
          value={newComment}
          onChange={handleCommentChange}
          className="comment-input"
        />
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>

      {comments.map((comment) => (
        <div key={comment._id} className="comment-item">
          <div className="user-date-container">
            <p className="comment-user">{comment.userId ? comment.userId.username : 'No user found'}</p>
            <p className="comment-date">{formatDateTime(comment.createdAt)}</p>
          </div>
          <p className="comment-content">{comment.content}</p>

          <div className="buttons">
            <button className="like-btn" onClick={() => handleLikeComment(comment._id)}>
              <FontAwesomeIcon icon={faThumbsUp} />
            </button>
            <span>{comment.likes.length}</span>
            <button className="dislike-btn" onClick={() => handleDislikeComment(comment._id)}>
              <FontAwesomeIcon icon={faThumbsDown} />
            </button>
            <span>{comment.dislikes.length}</span>
          </div>

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
            <button className="delete-btn" onClick={() => handleCommentDelete(comment._id)}>
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
              className="reply-input"
              placeholder="Write a reply..."
              value={newReply}
              onChange={handleReplyChange}
            />
            <button className="reply-btn" type="submit">
              Reply
            </button>
          </form>

          {comment.replies && comment.replies.length > 0 && !comment.showAllReplies && (
            <button className="show-replies-btn" onClick={() => handleShowAllReplies(comment._id)}>
              Show all replies ({comment.replies.length})
            </button>
          )}

          {comment.showAllReplies &&
            comment.replies.map((reply) => (
              <div key={reply._id} className="reply-item">
                <div className="user-date-container">
                  <p className="reply-user">{reply.userId ? reply.userId.username : 'No user found'}</p>
                  <p className="reply-date">{formatDateTime(reply.createdAt)}</p>
                </div>
                <p className="reply-content">{reply.content}</p>
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
