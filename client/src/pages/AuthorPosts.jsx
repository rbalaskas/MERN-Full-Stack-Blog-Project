import React, { useState, useEffect } from 'react'
import PostItem from '../components/PostItem';
import '../index.css'
import '../css/Posts.css'
import Loader from '../components/Loader';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AuthorPosts = () => {

    const [posts, setPosts] = useState([]);
    const [isLoading,setIsLoading] = useState(false);

    const {id}= useParams()
    
    useEffect(() => {
      const fetchPosts = async () => {
        setIsLoading(true);
        try{
          const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/users/${id}`)
          setPosts(response?.data);
        }
        catch(error){
          console.log(error)
        }
        setIsLoading(false);
      }

      fetchPosts();

    }, [id])

    if(isLoading){
      return <Loader/>
    }

  return (
    <section className='posts' style={{marginTop:"10rem",marginBottom:"5rem"}}>
        {posts.length > 0 ? <div className="container posts__container">
            {
                posts.map(({_id:id,thumbnail,category,title,description,creator, createdAt})=>
                <PostItem key={id} postID={id} thumbnail={thumbnail} category={category} title={title}
                description={description} authorID={creator} createdAt={createdAt}/>)
            }
        </div> : <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>No posts found!</h2>}
    </section>
  )
}

export default AuthorPosts