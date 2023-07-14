import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserComments, deleteComment } from '../api';

function UserComments() {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);

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

  return (
    <div>
      <h2>Your Comments</h2>
      <ul>
        {comments.map((comment) => (
          <li key={comment._id}>
            <p>{comment.content}</p>
            <button onClick={() => handleCommentDelete(comment._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserComments;
