import React, { useState } from 'react';
import axios from 'axios';
import '../css/Newsletter.css';

const NewsLetter = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/subscribers/subscribe`, { email });
      setMessage('Subscription successful!');
    } catch (error) {
      setMessage('Subscription failed. Please try again.');
      console.error('Error subscribing:', error);
    }

    setEmail('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Subscribe to our Newsletter</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Subscribe</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default NewsLetter;
