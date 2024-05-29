import React, { useState } from 'react';
import avatarImage from '../images/avatar1.jpg'; // Correct the import statement
import { Link } from 'react-router-dom';
import { FaEdit, FaCheck } from "react-icons/fa";
import '../css/UserProfile.css';
import '../index.css';

const UserProfile = () => {
  const [avatar, setAvatar] = useState(avatarImage); // Initialize with the imported image

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setnewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(URL.createObjectURL(file)); // Convert the file to a URL for rendering
    }
  };

  return (
    <section className="profile" style={{ marginTop: "10rem", marginBottom: "5rem" }}>
      <div className="container profile__container">
        <Link to={`/myposts/tester`} className='bt'>My Posts</Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={avatar} alt="profile picture" />
            </div>
            <form className="avatar__form">
              <input type="file" name="avatar" id="avatar" onChange={handleAvatarChange} accept="image/png, image/jpg, image/jpeg" />
              <label htmlFor='avatar'><FaEdit /></label>
            </form>
            <button className='profile__avatar-btn'><FaCheck /></button>
          </div>
          <h1>Tester tester</h1>
          <form  className="form profile__form">
            <p className="form__error-message">Something went wrong on submit!</p>
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
