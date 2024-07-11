import React, { useState, useRef } from 'react';
import emailjs from 'emailjs-com';
import '../css/Support.css';

const Support = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    const form = formRef.current;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      setNotification({ message: '* All fields are required.', type: 'error' });
      return;
    }

    setNotification({ message: '', type: '' });
    setLoading(true);

    emailjs.sendForm(
      process.env.REACT_APP_EMAILJS_SERVICE_ID_SUPPORT,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID_SUPPORT,
      form,
      process.env.REACT_APP_EMAILJS_USER_ID_SUPPORT
    ).then((result) => {
      setNotification({ message: 'Message sent successfully.', type: 'success' });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setLoading(false);
    }, (error) => {
      console.log(error.text);
      setNotification({ message: 'Failed to send message. Please try again later.', type: 'error' });
      setLoading(false);
    });
  };

  return (
    <div className="support-page" style={{marginTop:"10rem",marginBottom:"5rem"}}>
      <h2>Contact Support</h2>
      <form ref={formRef} onSubmit={sendEmail}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          disabled={loading}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          disabled={loading}
        />

        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleInputChange}
          required
          disabled={loading}
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          rows="6"
          required
          disabled={loading}
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
      {notification.message && (
        <p className={notification.type === 'error' ? 'error-message' : 'success-message'}>
          {notification.message}
        </p>
      )}
    </div>
  );
};

export default Support;
