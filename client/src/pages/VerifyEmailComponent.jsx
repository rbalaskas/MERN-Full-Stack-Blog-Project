import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../css/VerifyEmailComponent.css';

const VerifyEmailComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(location.search).get('token');

    if (token) {
      axios.get(`${process.env.REACT_APP_BASE_URL}/users/verify-email?token=${token}`)
        .then(response => {
          setMessage(response.data.message);
          setIsError(false);
        })
        .catch(error => {
          setMessage('Error verifying email.');
          setIsError(true);
          console.error('Error verifying email:', error);
          if (error.response && error.response.data) {
            console.error('Backend error message:', error.response.data.message);
          }
        });
    }
  }, [location.search]);

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="verify-email-container">
      <h2>Email Verification</h2>
      <p className={`verify-email-message ${isError ? 'verify-email-error' : 'verify-email-success'}`}>
        {message}
      </p>
      {!isError && (
        <button className="login-button" onClick={handleLoginRedirect}>
          Go to Login
        </button>
      )}
    </div>
  );
};

export default VerifyEmailComponent;
