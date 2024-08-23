import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';
import PostAuthor from './PostAuthor';
import '../css/Posts.css';
import axios from 'axios';

const PostItem = ({ postID, category, title, description, authorID, thumbnail, createdAt }) => {

    const shortdescription = description.length > 145 ? description.substr(0, 145) + '...' : description; 
    const posttitle = title.length > 40 ? title.substr(0, 40) + '...' : title; 

    const handleTitleClick = async () => {
        try {
            await axios.put(`${process.env.REACT_APP_BASE_URL}/posts/${postID}/views`);
        } catch (error) {
            console.error('Failed to increment view count:', error);
        }
    };

    return (
        <article className="post">
            <div className="post__thumbnail">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
            </div>
            <div className="post__content">
                <Link to={`/posts/${postID}`} onClick={handleTitleClick}>
                    <h3 style={{ textAlign: "center" }} dangerouslySetInnerHTML={{ __html: posttitle }} />
                </Link>
                <p dangerouslySetInnerHTML={{ __html: shortdescription }} />
                <div className="post__footer">
                    <PostAuthor authorID={authorID} createdAt={createdAt} />
                    <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link>
                </div>
            </div>
        </article>
    );
};

export default PostItem;
