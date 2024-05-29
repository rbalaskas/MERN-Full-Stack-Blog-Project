import React from 'react'
import { Link } from 'react-router-dom'
import avatar from '../images/avatar1.jpg'
import '../css/Posts.css'
import '../index.css'

const PostAuthor = () => {
  return (
    <Link to={`/posts/users/tester`} className='post__author'>
        <div className="post__author-avatar">
            <img src={avatar} alt="author avatar" />
        </div>
        <div className="post__author-details">
            <h5>By: Tester</h5>
            <small>Just Now</small>
        </div>
    </Link>
  )
}

export default PostAuthor