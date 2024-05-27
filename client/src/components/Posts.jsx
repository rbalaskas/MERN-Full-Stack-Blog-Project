import React, { useState } from 'react'
import PostItem from './PostItem';
import '../css/Posts.css'
import article1 from '../images/article1.jpg'
import article2 from '../images/article2.jpg'
import article3 from '../images/article3.jpg'

const DUMMY_POSTS = [
    {
      "id": 1,
      "thumbnail": article1,
      "category": "Technology",
      "title": "Lorem Ipsum",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      "authorID": 123
    },
    {
      "id": 2,
      "thumbnail": article2,
      "category": "Travel",
      "title": "Dolor Sit Amet",
      "description": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      "authorID": 456
    },
    {
      "id": 3,
      "thumbnail": article3,
      "category": "Food",
      "title": "Consectetur Adipiscing",
      "description": "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      "authorID": 789
    }
  ]
  


const Posts = () => {
    const [posts, setPosts] = useState(DUMMY_POSTS);

  return (
    <section className='posts'>
        <div className="container posts__container">
            {
                posts.map(({id,thumbnail,category,title,description,authorID})=>
                <PostItem key={id} postID={id} thumbnail={thumbnail} category={category} title={title}
                description={description} authorID={authorID} />)
            }
        </div>
    </section>
  )
}

export default Posts