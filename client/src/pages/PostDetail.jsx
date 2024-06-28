import React, { useEffect, useContext, useState } from 'react'
import PostAuthor from '../components/PostAuthor'
import { Link, useParams } from 'react-router-dom'
import '../index.css'
import '../css/PostDetail.css'
import Loader from '../components/Loader';
import DeletePost from './DeletePost';
import { UserContext } from '../context/userContext'
import axios from 'axios'


const PostDetail = () => {

  const {id} = useParams()
  const [post,setPost] = useState(null)
  const [error, setError] = useState(false)
  const {currentUser} = useContext(UserContext)
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    // Scroll the page to the top when the component mounts
    const getPost = async () => {
      setIsLoading(true);
      try{
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/posts/${id}`)
        setPost(response.data);
      }
      catch(error){
        console.log(error)
      }
      setIsLoading(false);
    }

    getPost();


    window.scrollTo(0, 0);
  }, []);


  if(isLoading){
    return <Loader/>
  }

  return (
   <section className="post-detail" style={{marginTop:"10rem",marginBottom:"5rem"}}>
    {error && <p className="error">{error}</p>}
    {post && <div className="container post-detail__container">
      <div className="post-detail__header">
        <PostAuthor authorID={post.creator} createdAt={post.createdAt}/>
        {currentUser?.id == post?.creator && <div className="post-detail__buttons">
          <Link to={`/posts/${post?.id}/edit`} className='btn sm primary'>Edit</Link>
          <DeletePost postId={id}/>
        </div>}
      </div>
      <h1>{post.title}</h1>
      <div className="post-detail__thumbnail">
        <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="post thumbnail" />
      </div>
      <p dangerouslySetInnerHTML={{__html: post.description}}></p>
    </div>}
   </section>
  )
}

export default PostDetail