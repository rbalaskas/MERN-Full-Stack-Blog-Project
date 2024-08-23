// src/pages/Leaderboard.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/Leaderboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComments, faStar, faNewspaper } from '@fortawesome/free-solid-svg-icons';

const Leaderboard = () => {
  const [topContributors, setTopContributors] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopContributors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/top-contributors`);
        setTopContributors(response.data);
      } catch (error) {
        console.error('Failed to fetch top contributors:', error);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchTopContributors();
  
    // Fetch data every hour
    const intervalId = setInterval(() => {
      fetchTopContributors();
    }, 3600000);
  
    return () => clearInterval(intervalId);
  }, []);

  const handleRowClick = (index) => {
    if (window.innerWidth <= 1024) {
      setExpandedRow(expandedRow === index ? null : index);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="leaderboard" style={{ marginTop: '1rem' }}>
      <h2>Top 10</h2>
      <table>
        <thead>
          <tr>
            <th>Place</th>
            <th>Profile</th>
            <th>Name</th>
            <th className="details">Points</th>
            <th className="details">Posts</th>
            <th className="details">Likes</th>
            <th className="details">Comments</th>
          </tr>
        </thead>
        <tbody>
          {topContributors.map((user, index) => (
            <React.Fragment key={user._id}>
              <tr
                className={index % 2 === 0 ? 'even-row' : 'odd-row'}
                onClick={() => handleRowClick(index)}
              >
                <td className={`place place-${index + 1}`}>{index + 1}</td>
                <td><img className="avatar" src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${user.avatar}`} alt="profile" /></td>
                <td>{user.name}</td>
                <td className="details">
                  <FontAwesomeIcon className="icon" icon={faStar} /> {user.totalPoints}
                </td>
                <td className="details">
                  <FontAwesomeIcon className="icon" icon={faNewspaper} /> {user.posts}
                </td>
                <td className="details">
                  <FontAwesomeIcon className="icon" icon={faThumbsUp} /> {user.totalLikes}
                </td>
                <td className="details">
                  <FontAwesomeIcon className="icon" icon={faComments} /> {user.totalComments}
                </td>
              </tr>
              {expandedRow === index && (
                <tr className="details-row">
                  <td colSpan="8" className="details-cell">
                    <div className="details-content">
                      <p><FontAwesomeIcon icon={faStar} /> Points: {user.totalPoints}</p>
                      <p><FontAwesomeIcon icon={faNewspaper} /> Posts: {user.posts}</p>
                      <p><FontAwesomeIcon className="icon" icon={faThumbsUp} /> Likes: {user.totalLikes}</p>
                      <p><FontAwesomeIcon className="icon" icon={faComments} /> Comments: {user.totalComments}</p>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
