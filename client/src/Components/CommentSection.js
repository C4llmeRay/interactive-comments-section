import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllComments, addComment, deleteComment, editComment, addReply, deleteReply, editReply } from '../api';

function CommentSection() {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [editReplyId, setEditReplyId] = useState(null);
  const [editReplyContent, setEditReplyContent] = useState('');

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
        if (response.user && response.user._id) {
          setUser(response.user);
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    if (newComment.trim() === '') return;

    const commentData = {
      content: newComment,
      createdAt: new Date().toISOString(),
    };

    addComment(commentData)
      .then((response) => {
        console.log('Add comment response:', response);
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
        setIsEditing(false);
        setEditCommentId(null);
        setEditCommentContent('');
        fetchComments();
      })
      .catch((error) => {
        console.error('Error updating comment:', error);
      });
  };

  const handleReplySubmit = (commentId, replyToId) => {
  if (!user || replyContent.trim() === '') return;

  const replyData = {
    content: replyContent,
    userId: user._id,
    createdAt: new Date().toISOString(),
  };

  addReply(commentId, replyToId, replyData)
    .then(() => {
      setReplyContent('');
      fetchComments();
    })
    .catch((error) => {
      console.error('Error adding reply:', error);
    });
};

  const handleReplyDelete = (commentId, replyId) => {
    deleteReply(commentId, replyId)
      .then(() => {
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
        setEditReplyId(null);
        setEditReplyContent('');
        fetchComments();
      })
      .catch((error) => {
        console.error('Error editing reply:', error);
      });
  };

  function disconnect() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="comment-section">
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
        />
        <button className="submit-btn" type="submit">
          Submit
        </button>
      </form>

      {comments.map((comment) => (
        <div key={comment._id} className="comment-item">
          <div className="user-date-container">
            <p>{comment.userId ? comment.userId.username : 'No user found'}</p>
            <p>{comment.createdAt}</p>
          </div>
          <p className="comment">{comment.content}</p>

          {isEditing && editCommentId === comment._id ? (
            <div className="edit-input-container">
              <input
                type="text"
                value={editCommentContent}
                onChange={(e) => setEditCommentContent(e.target.value)}
              />
              <button
                onClick={() => {
                  handleCommentEdit(comment._id, editCommentContent);
                }}
              >
                Save
              </button>
            </div>
          ) : (
            <>
              {comment.userId && comment.userId._id === user?._id && (
                <div className="buttons">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setIsEditing(true);
                      setEditCommentId(comment._id);
                      setEditCommentContent(comment.content);
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
              )}

              <form
                className="reply-form"
                onSubmit={(event) => {
                event.preventDefault();
                handleReplySubmit(comment._id, comment._id); // Pass both commentId and replyToId
               }}
              >
                <textarea
                  className="reply-input"
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
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
                      <p>{reply.createdAt}</p>
                    </div>
                    <p className="comment">{reply.content}</p>
                    {reply.userId && reply.userId._id === user?._id && (
                      <div className="buttons">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setEditReplyId(reply._id);
                            setEditReplyContent(reply.content);
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
                    )}
                    {isEditing && editReplyId === reply._id && (
                      <div className="edit-input-container">
                        <input
                          type="text"
                          value={editReplyContent}
                          onChange={(e) => setEditReplyContent(e.target.value)}
                        />
                        <button
                          onClick={() => {
                            handleReplyEdit(comment._id, reply._id, editReplyContent);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentSection;
