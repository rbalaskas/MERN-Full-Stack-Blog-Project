import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Register.css';
import '../index.css';
import axios from 'axios';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });

  const [error, setError] = useState('');
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top when the component mounts

    const savedUserData = JSON.parse(localStorage.getItem('userData'));
    const savedAgreed = JSON.parse(localStorage.getItem('agreed'));
    if (savedUserData) {
      setUserData(savedUserData);
    }
    if (savedAgreed) {
      setAgreed(savedAgreed);
    }
  }, []);

  const changeInputHandler = (e) => {
    const updatedUserData = {
      ...userData,
      [e.target.name]: e.target.value
    };
    setUserData(updatedUserData);
    localStorage.setItem('userData', JSON.stringify(updatedUserData));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreed) {
      setError('You must agree to the terms and conditions.');
      return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/users/register`, userData);
      const newUser = response.data;

      if (!newUser) {
        setError("Something went wrong. Please try again.");
      } else {
        console.log(newUser.message);
      }

      localStorage.removeItem('userData');
      localStorage.removeItem('agreed');
      navigate('/');
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setAgreed(e.target.checked);
    localStorage.setItem('agreed', JSON.stringify(e.target.checked));
  };

  return (
    <section className="register" style={{ marginTop: "10rem", marginBottom: "5rem" }}>
      <div className="container">
        <h2>Sign up</h2>
        <form className="form register__form" onSubmit={registerUser}>
          {error && <p className={`form__error-message ${error ? 'verify-email-error' : ''}`}>{error}</p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onChange={changeInputHandler} autoFocus />
          <input type="email" placeholder='Email' name='email' value={userData.email} onChange={changeInputHandler} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onChange={changeInputHandler} />
          <input type="password" placeholder='Confirm Password' name='password2' value={userData.password2} onChange={changeInputHandler} />
          <label className="terms-checkbox">
            I agree to the <Link to="/termsandconditions" className="terms-link">Terms and Conditions</Link>
            <input type="checkbox" checked={agreed} onChange={handleCheckboxChange} />
          </label>
          <button type="submit" className='btn primary'>Sign up</button>
        </form>
        <small>Already have an account? <Link to='/login'>Sign in</Link></small>
      </div>
    </section>
  );
};

export default Register;
