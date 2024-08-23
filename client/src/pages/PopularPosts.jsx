import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../css/PopularPosts.css';

const PopularPosts = () => {
  const [popularPosts, setPopularPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/popular`);
        setPopularPosts(response.data);
      } catch (error) {
        console.error('Failed to fetch popular posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularPosts();
  }, []);

  const handleTitleClick = async (postId) => {
    try {
      await axios.put(`${process.env.REACT_APP_BASE_URL}/posts/${postId}/views`);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };


  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Helper function to truncate text and convert to HTML
  const truncateTextToHTML = (text = '', length) => {
    const truncatedText = text.length > length ? text.substr(0, length) + '...' : text;
    return { __html: truncatedText };
  };

  return (
    <div className='popular-posts' style={{ marginBottom: "3rem" }}>
      {popularPosts.length > 0 ? (
        <div className="popular-posts__container">
          {popularPosts.slice(0, 3).map(post => (
            <div key={post._id} className='popular-post'>
              <div className='popular-post-thumbnail'>
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt={post.title} />
              </div>
              <Link to={`/posts/${post._id}`} onClick={() => handleTitleClick(post._id)}>
                <h3 style={{ textAlign: "center" }} dangerouslySetInnerHTML={truncateTextToHTML(post.title, 50)} />
              </Link>
              <Link to={`/posts/categories/${post.category}`}>
                <p 
                  style={{
                    backgroundColor: "#e8e8fa",
                    display: "inline-block", // Changed from flex to inline-block
                    padding: "2px 4px",
                    borderRadius: "4px",
                    margin: "0",
                    fontWeight: "bold",
                    textAlign: "center"
                  }}
                >
                  <span dangerouslySetInnerHTML={{ __html: post.category }} />
                </p>
              </Link>
              <p dangerouslySetInnerHTML={truncateTextToHTML(post.description, 145)} />
              <div className="popular-post-footer">
                <p style={{ color: "#EE70BC", fontWeight: "bold" }}>{`Likes: ${post.likes}`}</p>
                <p style={{ color: "#EE70BC", fontWeight: "bold" }}>{`Comments: ${post.comments.length}`}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>No posts found!</h2>
      )}
    </div>
  );
};

export default PopularPosts;
