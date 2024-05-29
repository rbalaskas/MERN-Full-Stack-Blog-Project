import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import article1 from '../images/article1.jpg';
import article2 from '../images/article2.jpg';
import article3 from '../images/article3.jpg';
import '../css/Authors.css'
import '../index.css'

const authorsData = [
  {
    id: 1,
    avatar: article1,
    name: "John Doe",
    posts: 10
  },
  {
    id: 2,
    avatar: article2,
    name: "Jane Smith",
    posts: 3
  },
  {
    id: 3,
    avatar: article3,
    name: "Emily Johnson",
    posts: 11
  },
  {
    id: 4,
    avatar: article2,
    name: "Michael Brown",
    posts: 8
  }
];

const Authors = () => {
  const [authors, setAuthors] = useState(authorsData);

  return (
    <section className="authors" style={{marginTop:"10rem",marginBottom:"5rem"}}>
      {authors.length > 0 ? (
        <div className="container authors__container">
          {authors.map(({ id, avatar, name, posts }) => (
            <Link to={`/posts/users/${id}`} key={id} className="author">
              <div className="author__avatar">
                <img src={avatar} alt={`Image of ${name}`} />
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
