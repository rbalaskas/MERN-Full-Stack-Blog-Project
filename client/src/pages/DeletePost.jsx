import React, { useState, useContext, useEffect } from 'react'
import { UserContext } from '../context/userContext'
import { useLocation, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Loader from '../components/Loader';

const DeletePost = ({postId : id}) => {

  const navigate = useNavigate();
  const {currentUser} = useContext(UserContext);
  const token = currentUser?.token;
  const location = useLocation
  const [isLoading,setIsLoading] = useState(false)


  useEffect(()=> {
    if(!token){
      navigate('/login')
    }
  }, [])

  const removePost = async () => {
    setIsLoading(true);
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BASE_URL}/posts/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        if (location.pathname === `/myposts/${currentUser/id}`) {
          navigate(0);
        } else {
          navigate('/');
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.log("Couldn't delete a post.", error);
    }
  }


  return (
    <Link className="btn sm danger" onClick={() => removePost(id)}>Delete</Link>
  )
}

export default DeletePost