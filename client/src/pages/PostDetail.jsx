import React, { useEffect } from 'react'
import PostAuthor from '../components/PostAuthor'
import { Link } from 'react-router-dom'
import '../index.css'
import thumbnail from '../images/article2.jpg'
import '../css/PostDetail.css'

const PostDetail = () => {

  useEffect(() => {
    // Scroll the page to the top when the component mounts
    window.scrollTo(0, 0);
  }, []); // Run this effect only once when the component mounts


  return (
   <section className="post-detail" style={{marginTop:"10rem",marginBottom:"5rem"}}>
    <div className="container post-detail__container">
      <div className="post-detail__header">
        <PostAuthor/>
        <div className="post-detail__buttons">
          <Link to={`/posts/tester/edit`} className='btn sm primary'>Edit</Link>
          <Link to={`/posts/tester/delete`} className='btn sm danger'>Delete</Link>
        </div>
      </div>
      <h1>This is the post title!</h1>
      <div className="post-detail__thumbnail">
        <img src={thumbnail} alt="post thumbnail" />
      </div>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus ipsum iste sint corporis accusantium, maiores deleniti exercitationem consectetur inventore nisi nam voluptatibus rerum aliquam voluptatum? Repellendus voluptatum, perferendis autem atque quis cumque placeat accusamus non, fugiat ullam dolore voluptas cum!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus ipsum iste sint corporis accusantium, maiores deleniti exercitationem consectetur inventore nisi nam voluptatibus rerum aliquam voluptatum? Repellendus voluptatum, perferendis autem atque quis cumque placeat accusamus non, fugiat ullam dolore voluptas cum!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus ipsum iste sint corporis accusantium, maiores deleniti exercitationem consectetur inventore nisi nam voluptatibus rerum aliquam voluptatum? Repellendus voluptatum, perferendis autem atque quis cumque placeat accusamus non, fugiat ullam dolore voluptas cum!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus ipsum iste sint corporis accusantium, maiores deleniti exercitationem consectetur inventore nisi nam voluptatibus rerum aliquam voluptatum? Repellendus voluptatum, perferendis autem atque quis cumque placeat accusamus non, fugiat ullam dolore voluptas cum!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus ipsum iste sint corporis accusantium, maiores deleniti exercitationem consectetur inventore nisi nam voluptatibus rerum aliquam voluptatum? Repellendus voluptatum, perferendis autem atque quis cumque placeat accusamus non, fugiat ullam dolore voluptas cum!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus ipsum iste sint corporis accusantium, maiores deleniti exercitationem consectetur inventore nisi nam voluptatibus rerum aliquam voluptatum? Repellendus voluptatum, perferendis autem atque quis cumque placeat accusamus non, fugiat ullam dolore voluptas cum!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus ipsum iste sint corporis accusantium, maiores deleniti exercitationem consectetur inventore nisi nam voluptatibus rerum aliquam voluptatum? Repellendus voluptatum, perferendis autem atque quis cumque placeat accusamus non, fugiat ullam dolore voluptas cum!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus ipsum iste sint corporis accusantium, maiores deleniti exercitationem consectetur inventore nisi nam voluptatibus rerum aliquam voluptatum? Repellendus voluptatum, perferendis autem atque quis cumque placeat accusamus non, fugiat ullam dolore voluptas cum!</p>
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Necessitatibus ipsum iste sint corporis accusantium, maiores deleniti exercitationem consectetur inventore nisi nam voluptatibus rerum aliquam voluptatum? Repellendus voluptatum, perferendis autem atque quis cumque placeat accusamus non, fugiat ullam dolore voluptas cum!</p>
      
    </div>
   </section>
  )
}

export default PostDetail