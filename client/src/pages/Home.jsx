import React from 'react'
import Posts from '../components/Posts'
import '../css/Home.css'
import article3 from '../images/article3.jpg'
import '../index.css'

const Home = () => {
  return (
    <div className='home'>
      <div className="home__banner">
        <img src={article3} alt="test banner" />
      </div>
      <Posts/>
    </div>
  )
}

export default Home
