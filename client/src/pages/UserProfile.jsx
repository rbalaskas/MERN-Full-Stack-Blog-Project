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
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setnewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const { currentUser } = useContext(UserContext);
  const [error, setError] = useState('');

  const token = currentUser?.token;
  const navigate = useNavigate();

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
      setError('Something went wrong with fetch user. Please try again.');
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


  useEffect(() => {
    const getUser = async () =>{
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/users/${currentUser.userId}`, {withCredentials: true, headers: {Authorization: `Bearer ${token}`}})
      const {name,email,avatar} = response.data;
      setName(name);
      setEmail(email);
      setAvatar(avatar);
    }
    getUser();
  }, [])


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
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.log(error);
    }
  };


  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {
        const userData = new FormData();
        userData.set('name', name);
        userData.set('email', email);
        userData.set('currentPassword', currentPassword);
        userData.set('newPassword', newPassword);
        userData.set('confirmNewPassword', confirmNewPassword);

        const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}/users/edit-user`, userData, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            navigate('/logout');
        }
    } catch (error) {
        console.error('Error response:', error); // Log detailed error response
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
        } else {
            setError('An unexpected error occurred. Please try again.');
        }
    }
}

  return (
    <section className="profile" style={{ marginTop: "10rem", marginBottom: "5rem" }}>
      <div className="container profile__container">
      <Link to={`/myposts/${currentUser.userId}`} className='about-us__cta'>
        <button className="about-us__cta-button">My Posts</button>
      </Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${avatar}`} alt="profile image" />
            </div>
            <form className="avatar__form">
              <input type="file" name="avatar" id="avatar" onChange={handleAvatarChange} accept="image/png, image/jpg, image/jpeg" />
              <label htmlFor='avatar' onClick={() => setIsAvatarTouched(true)}><FaEdit /></label>
            </form>
            {isAvatarTouched && <button className='profile__avatar-btn' onClick={changeAvatarHandle}><FaCheck /></button>}
          </div>
          <h1>{currentUser.name}</h1>
          <form  className="form profile__form" onSubmit={updateUserDetails}>
          {error && <p className="form__error-message">{error}</p>}
            <input type="text" placeholder='Full Name' value={name} onChange={e=> setName(e.target.value)}/>
            <input type="email" placeholder='Email' value={email} onChange={e=> setEmail(e.target.value)}/>
            <input type="password" placeholder='Current Password' value={currentPassword} onChange={e=> setCurrentPassword(e.target.value)}/>
            <input type="password" placeholder='New Password' value={newPassword} onChange={e=> setnewPassword(e.target.value)}/>
            <input type="password" placeholder='Confirm New Password' value={confirmNewPassword} onChange={e=> setConfirmNewPassword(e.target.value)}/>
            <button type="submit" className='btn primary'>Update Personal Details</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;
