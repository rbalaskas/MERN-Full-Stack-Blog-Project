import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../css/Authors.css'
import '../index.css'
import axios from 'axios';
import Loader from '../components/Loader'

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getAuthors = async () => {
      setIsLoading(true);
      try{
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users`)
        setAuthors(response.data)
      }
      catch(error){
        console.log(error);
      }
      setIsLoading(false);
    }
    
    getAuthors()

  }, [])

  if(isLoading){
    <Loader/>
  }


  return (
    <section className="authors" style={{marginTop:"10rem",marginBottom:"5rem"}}>
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({_id: id, avatar, name, posts }) => (
            <Link to={`/posts/users/${id}`} key={id} className="author">
              <div className="author__avatar">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt={`Image of ${name}`} />
              </div>
              <div className="author__info">
                <h4>{name}</h4>
                <p>{posts} posts</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2 className='center'>No users or authors found</h2>
      )}
    </section>
  );
}

export default Authors;
