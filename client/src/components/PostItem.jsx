import React from 'react'
import { Link } from 'react-router-dom'
import '../index.css'
import PostAuthor from './PostAuthor'
import '../css/Posts.css'

const PostItem = ({postID,category,title,description,authorID,thumbnail, createdAt}) => {
    
    const shortdescription = description.length > 145 ? description.substr(0,145) + '...' : description; 
    const posttitle = title.length > 30 ? title.substr(0,30) + '...' : title; 

    return (
    <article className="post">
        <div className="post__thumbnail">
            <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
        </div>
        <div className="post__content">
            <Link to={`/posts/${postID}`}>
                <h3>{posttitle}</h3>
            </Link>
            <p dangerouslySetInnerHTML={{__html : shortdescription}}/>
            <div className="post__footer">
                <PostAuthor authorID={authorID} createdAt={createdAt}/>
                <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link>
            </div>
        </div>
    </article>
    
  )
}

export default PostItem