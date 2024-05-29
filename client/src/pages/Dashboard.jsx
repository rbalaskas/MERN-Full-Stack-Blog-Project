import React, { useState } from 'react'
import { DUMMY_POSTS } from './../data';
import { Link } from 'react-router-dom';
import '../css/Dashboard.css'
import '../index.css'

const Dashboard = () => {

  const[posts,setPosts] = useState(DUMMY_POSTS)

  return (
   <section className="dashboard" style={{marginTop:"10rem",marginBottom:"5rem"}}>
    {
      posts.length ? <div className="container dashboard__container">
        {
          posts.map(post => {
            return <article key={post.id} className='dashboard__post'>
              <div className="dashboard__post-info">
                <div className="dashboard__post-thumbnail">
                  <img src={post.thumbnail} alt="post thumbnail" />
                </div>
                <h5>{post.title}</h5>
              </div>
              <div className="dashboard__post-actions">
                <Link to={`/posts/${post.id}`} className='btn sm'>View</Link>
                <Link to={`/posts/${post.id}/edit`} className='btn sm primary'>Edit</Link>
                <Link to={`/posts/${post.id}/delete`} className='btn sm danger'>Delete</Link>
              </div>
            </article>
          })
        }
    </div> : <h2 className='center'>You don't have posts yet.</h2>
  }
   </section>
  )
}

export default Dashboard