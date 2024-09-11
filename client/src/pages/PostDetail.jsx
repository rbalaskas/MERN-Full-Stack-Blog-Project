import React, { useEffect, useContext, useState } from 'react';
import PostAuthor from '../components/PostAuthor';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';
import DeletePost from './DeletePost';
import { UserContext } from '../context/userContext';
import axios from 'axios';
import { format, isValid } from 'date-fns';
import '../index.css';
import '../css/PostDetail.css';
import ReportProblem from './ReportProblem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFlag } from '@fortawesome/free-solid-svg-icons';

const PostDetail = () => {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const [post, setPost] = useState(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const navigate = useNavigate(); 
  const token = currentUser?.token;

  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`);
        setPost(response.data);
        setLikes(response.data.likes || 0);
      } catch (error) {
        console.error(error);
        setError(true);
      }
      setIsLoading(false);
    };

    getPost();
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}/like`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setIsLiked(response.data.isLiked);
        setLikes(response.data.likesCount);
      } catch (error) {
        console.error(error);
      }
    };

    if (token) {
      fetchLikeStatus();
    }
  }, [id, token]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/comments/${id}`);
        const commentsWithUserNames = await Promise.all(
          response.data.map(async (comment) => {
            try {
              const userResponse = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${comment.creator}`);
              const user = userResponse.data;
              return {
                ...comment,
                userName: user.name,
                createdAt: isValid(new Date(comment.createdAt)) 
                  ? format(new Date(comment.createdAt), 'd/M/yyyy, h:mm:ss a') 
                  : 'Invalid Date',
              };
            } catch (userError) {
              console.error(userError);
              return {
                ...comment,
                userName: 'Unknown User',
                createdAt: isValid(new Date(comment.createdAt)) 
                  ? format(new Date(comment.createdAt), 'd/M/yyyy, h:mm:ss a') 
                  : 'Invalid Date',
              };
            }
          })
        );
        setComments(commentsWithUserNames);
      } catch (error) {
        console.error(error);
      }
    };

    fetchComments();
  }, [id, commentSubmitted]);

  const handleLike = async () => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_BASE_URL}/comments/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setLikes(response.data.likes);
      setIsLiked(response.data.isLiked);
    } catch (error) {
      console.error("Error while liking the post:", error);
    }
  };
  

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL}/comments/${id}`, {
        content: newComment,
        creator: currentUser.id,
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setCommentSubmitted(prev => !prev);

      setNewComment('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Post URL copied to clipboard');
  };

  if (isLoading) {
    return <Loader />;
  }

  const handleReportClick = () => {
    navigate(`/report-a-problem?postId=${id}`); // Navigate to the report-a-problem page with the post ID
  };

  const handleReportCommentClick = (commentId) => {
    navigate(`/report-a-problem?postId=${id}&commentId=${commentId}`); // Include the postId and commentId in the query params
  };
  


  return (
    <section className="post-detail" style={{ marginTop: '10rem', marginBottom: '5rem' }}>
      {error && <p className="error">Error loading post.</p>}
      {post && (
        <div className="container post-detail__container">
          <div className="post-detail__header">
            <PostAuthor authorID={post.creator} createdAt={post.createdAt} />
            {currentUser?.id === post?.creator && (
              <div className="post-detail__buttons">
                <Link to={`/posts/${post.id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <div className="post-detail__title-container">
            <h1 className="post-detail__title">{post.title}</h1>
            <FontAwesomeIcon
              icon={faFlag}
              style={{ color: '#ff0000', marginLeft: '10px', cursor: 'pointer' }}
              onClick={handleReportClick} // Handle click to navigate to the report form
              title="Report a Problem"
              alt='Report a Problem'
            />
          </div>
          <div className="post-detail__thumbnail">
            <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="post thumbnail" />
          </div>
          <p dangerouslySetInnerHTML={{ __html: post.description }}></p>
        </div>
      )}

      <div className="like-and-comment">
        <div className="like-share-buttons">
          <button onClick={handleLike} className={`btn like-button ${isLiked ? 'liked' : ''}`}>
            {isLiked ? 'Unlike' : 'Like'} ({likes})
          </button>
          <button onClick={handleShare} className="btn share-button">
            Share
          </button>
        </div>
        <div className="comments-section">
          <h3>Comments</h3>
          <ul className="comments-list">
              {comments.map((comment) => (
                <li key={comment._id} className="comment-item">
                  <small style={{ color: 'darkgray', fontSize: '12px' }} className="comment-metadata">
                    <span style={{ fontWeight: 'bold' }}>{comment.userName}</span>
                    <span>
                      <FontAwesomeIcon
                        icon={faFlag}
                        style={{ color: '#ff0000', marginLeft: '10px', cursor: 'pointer' }}
                        onClick={() => handleReportCommentClick(comment._id)} // Pass comment._id to the function
                        title="Report a Problem"
                        alt='Report a Problem'
                      />
                    </span><br/>
                    <span>{comment.createdAt}</span>
                  </small>
                  <p className="comment-content">{comment.content}</p>
                </li>
              ))}
            </ul>
          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows="3"
              required
              maxlength="300"
            ></textarea>
            <button type="submit" className="btn submit-button">
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
