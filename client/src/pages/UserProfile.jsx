import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaCheck } from "react-icons/fa";
import '../css/UserProfile.css';
import '../index.css';
import { UserContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserProfile = () => {
  const [avatar, setAvatar] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);
  const token = currentUser?.token;

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUserData();
    }
  }, [token, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const userData = response.data;
      setAvatar(userData.avatar);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file));
      setAvatarFile(file);
    }
  };

  const changeAvatarHandle = async () => {
    setIsAvatarTouched(false);
    if (!avatarFile) return;

    try {
      const postData = new FormData();
      postData.append('avatar', avatarFile);

      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/change-avatar`, postData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAvatar(response.data.avatar);
      console.log(response.data.avatar);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="profile" style={{ marginTop: "10rem", marginBottom: "5rem" }}>
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser.userId}`} className='bt'>My Posts</Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="profile picture" />
            </div>
            <form className="avatar__form">
              <input type="file" name="avatar" id="avatar" onChange={handleAvatarChange} accept="image/png, image/jpg, image/jpeg" />
              <label htmlFor='avatar' onClick={() => setIsAvatarTouched(true)}><FaEdit /></label>
            </form>
            {isAvatarTouched && <button className='profile__avatar-btn' onClick={changeAvatarHandle}><FaCheck /></button>}
          </div>
          <h1>{currentUser.name}</h1>
          {/* Other form fields */}
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
