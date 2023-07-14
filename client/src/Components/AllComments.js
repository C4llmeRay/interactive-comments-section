import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AllCommentsSection() {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState({
    content: '',
    email: '',
    userId: '',
    createdAt: Date.now(),
    upvotes: '',
    replies: [],
  });
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState({
    _id: '',
    email: '',
  });
  const [replyContent, setReplyContent] = useState('');
  const [editCommentContent, setEditCommentContent] = useState('');
  const [editCommentId, setEditCommentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      axios
        .post('http://localhost:3005/user/verify', {
          token: localStorage.getItem('token'),
        })
        .then(({ data }) => {
          if (data.userData._id) {
            console.log(data.userData);
            setUser(data.userData);
            fetchAllComments();
          } else {
            navigate('/');
          }
        });
    } else {
      navigate('/');
    }
  }, []);

  const fetchAllComments = () => {
    axios
      .get('http://localhost:3005/comment')
      .then(({ data }) => {
        console.log('all comments', data);
        setComments(data);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  };

  const handleCommentChange = (event) => {
    const { name, value } = event.target;
    setNewComment((prevComment) => ({
      ...prevComment,
      [name]: value,
      userId: user._id,
    }));
  };

  const handleCommentSubmit = (event) => {
    event.preventDefault();
    console.log(newComment);

    // Update newComment object with user's email
    const updatedComment = { ...newComment, email: user.email };

    axios
      .post('http://localhost:3005/comment', updatedComment)
      .then(() => {
        setNewComment((prevComment) => ({
          ...prevComment,
          content: '',
        }));
        // Fetch the updated comments after successful submission
        fetchAllComments();
      })
      .catch((error) => {
        console.error('Error sending comment data:', error);
      });
  };

  const handleCommentDelete = (commentId) => {
    const shouldDelete = window.confirm('Are you sure you want to delete this comment?');
    if (shouldDelete) {
      axios
        .delete(`http://localhost:3005/comment/${commentId}`)
        .then(() => {
          setComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== commentId)
          );
        })
        .catch((error) => {
          console.error('Error deleting comment:', error);
        });
    }
  };

  const handleCommentEdit = (commentId, updatedContent) => {
    axios
      .put(`http://localhost:3005/comment/${commentId}`, { content: updatedContent })
      .then(() => {
        // Fetch the updated comments after successful edit
        fetchAllComments();
        setIsEditing(false); // Reset the edit mode
        setEditCommentContent(''); // Clear the edit comment content
        setEditCommentId(null); // Clear the edit comment ID
      })
      .catch((error) => {
        console.error('Error updating comment:', error);
      });
  };

  const handleReply = (commentId) => {
    const reply = {
      content: replyContent,
      email: user.email, 
      userId: user._id,
      createdAt: Date.now(),
    };
  
    axios
      .post(`http://localhost:3005/comment/${commentId}/reply`, reply)
      .then(() => {
        // Fetch the updated comments after successful reply
        fetchAllComments();
        setReplyContent(''); // Clear the reply input
      })
      .catch((error) => {
        console.error('Error sending reply data:', error);
      });
  };

  function disconnect() {
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className="comments-container">
      <div className="header">
        <h2>All Comments</h2>
      </div>
  
      <div className="comment-section">
        {comments.map((comment) => (
          <div key={comment._id} className="comment-item">
            <div className="user-date-container">
              <p>{comment.email}</p>
              <p>{comment.createdAt}</p>
            </div>
            <p className="comments">{comment.content}</p>
            <div className="replies">
            {comment.replies &&
               comment.replies.map((reply) => (
                 <div key={reply._id} className="reply-item">
                   <div className="user-date-container">
                    <p>{reply.email}</p>
                     <p>{reply.createdAt}</p>
                  </div>
                  <p className="comments reply-comment">{reply.content}</p>
                </div>
               ))}
            </div>
  
            {/* Edit Button */}
            {comment.userId === user._id && (
              <button
                className="edit-btn"
                onClick={() => {
                  setIsEditing(true);
                  setEditCommentContent(comment.content);
                  setEditCommentId(comment._id);
                }}
              >
                Edit
              </button>
            )}
  
            {/* Reply Form */}
            <form className="reply-form" onSubmit={(event) => handleReply(comment._id, event)}>
              <textarea
                className="reply-input"
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(event) => setReplyContent(event.target.value)}
              ></textarea>
              <button className="reply-btn" type="submit">Reply</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AllComments;