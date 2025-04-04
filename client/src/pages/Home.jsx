import React, { useContext } from 'react';
import Posts from '../components/Posts';
import PopularPosts from '../pages/PopularPosts';
import Leaderboard from '../pages/Leaderboard';
import AboutUs from '../pages/AboutUs.jsx';
import '../css/Home.css';
import welcome_banner from '../images/welcome_banner.png';
import { UserContext } from './../context/userContext.js';

const Home = () => {
  const { currentUser } = useContext(UserContext);

  return (
    <div className='home'>
      {currentUser === null && (
        <>
        <div className="home__banner">
          <img src={welcome_banner} alt="Welcome O Koutsompolis banner" />
        </div>
        <AboutUs/>
        </>
      )}
      <h3 className="home__section-title">Popular Posts</h3>
      <PopularPosts />
      {currentUser !== null && (
        <>
          <h3 className="home__section-title">Recent Posts</h3>
          <Posts />
          <h3 className="home__section-title" style={{marginTop:'3rem'}}>Top Contributors</h3>
          <Leaderboard /> 
        </>
      )}
    </div>
  );
}

export default Home;
