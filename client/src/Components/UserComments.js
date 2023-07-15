import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserComments, deleteComment, editComment } from '../api';
import '../Styles/UserComments.css';

function UserComments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
    } else {
      fetchUserComments();
    }
  }, [navigate]);

  const fetchUserComments = () => {
    getUserComments()
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching user comments:', error);
      });
  };

  const handleCommentDelete = (commentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (confirmDelete) {
      deleteComment(commentId)
        .then(() => {
          fetchUserComments();
        })
        .catch((error) => {
          console.error('Error deleting comment:', error);
        });
    }
  };

  const handleCommentEdit = (comment) => {
    setSelectedComment(comment);
    setEditContent(comment.content);
  };

  const handleEditContentChange = (event) => {
    setEditContent(event.target.value);
  };

  const handleCommentUpdate = () => {
    if (editContent.trim() === '') return;

    editComment(selectedComment._id, { content: editContent })
      .then(() => {
        console.log('Comment updated successfully');
        setSelectedComment(null);
        setEditContent('');
        fetchUserComments();
      })
      .catch((error) => {
        console.error('Error updating comment:', error);
      });
  };

  const handleShowReplies = (commentId) => {
    setComments((prevComments) => {
      return prevComments.map((comment) => {
        if (comment._id === commentId) {
          return { ...comment, showReplies: !comment.showReplies };
        }
        return comment;
      });
    });
  };

  const formatDateTime = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div className="user-comments-container">
      {comments.length === 0 ? (
        <p>You have no comments yet. Create one to see your comments.</p>
      ) : (
        <ul className="user-comments-list">
          {comments.map((comment) => (
            <li key={comment._id} className="user-comment-item">
              <div className="user-comment-content">
                <p>{comment.content}</p>
                <p className="user-comment-date">{formatDateTime(comment.createdAt)}</p>
                <p className="user-comment-reply-count">
                  {comment.replies.length} {comment.replies.length === 1 ? 'Reply' : 'Replies'}
                </p>
                {selectedComment && selectedComment._id === comment._id ? (
                  <div className="user-comment-edit-form">
                    <textarea
                      value={editContent}
                      onChange={handleEditContentChange}
                      placeholder="Edit comment..."
                      className="user-comment-edit-textarea"
                    />
                    <button className="user-comment-save-btn" onClick={handleCommentUpdate}>
                      Save
                    </button>
                    <button className="user-comment-cancel-btn" onClick={() => setSelectedComment(null)}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="user-comment-buttons">
                    <button className="user-comment-delete-btn" onClick={() => handleCommentDelete(comment._id)}>
                      Delete
                    </button>
                    <button className="user-comment-edit-btn" onClick={() => handleCommentEdit(comment)}>
                      Edit
                    </button>
                    <button className="user-comment-show-replies-btn" onClick={() => handleShowReplies(comment._id)}>
                      {comment.showReplies ? 'Hide Replies' : 'Show Replies'}
                    </button>
                  </div>
                )}
              </div>
              {comment.showReplies && (
                <ul className="user-comment-replies">
                  {comment.replies.map((reply) => (
                    <li key={reply._id} className="user-comment-reply">
                      <p>{reply.content}</p>
                      <p className="user-comment-date">{formatDateTime(reply.createdAt)}</p>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserComments;
