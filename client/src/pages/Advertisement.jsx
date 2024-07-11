import React, { useState, useEffect, useRef } from 'react';
import emailjs from 'emailjs-com';
import '../css/Advertisement.css'; // Import CSS file for styling
import advertise from '../images/advertiseBanner.png';
import businessImage1 from '../images/mrluke.jpg'; // Import sample business images
import businessImage2 from '../images/en texno.jpg';

const Advertisement = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    message: ''
  });

  const [notification, setNotification] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false); // Add loading state
  const formRef = useRef();
  const contactFormRef = useRef(); // Ref for the contact form section

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const SendEmail = (e) => {
    e.preventDefault();
    const form = formRef.current;
    const businessName = form.businessName.value.trim();
    const contactPerson = form.contactPerson.value.trim();
    const contactPhone = form.contactPhone.value.trim();
    const contactEmail = form.contactEmail.value.trim();
    const message = form.message.value.trim();

    let valid = true;

    if (!businessName || !contactPerson || !contactPhone || !contactEmail || !message) {
      setNotification({ message: '* All fields are required.', type: 'error' });
      valid = false;
    }

    if (!valid) {
      return;
    }

    setNotification({ message: '', type: '' });
    setLoading(true); // Set loading to true

    emailjs.sendForm(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      form,
      process.env.REACT_APP_EMAILJS_USER_ID,
    ).then((result) => {
      setNotification({ message: 'Inquiry sent successfully.', type: 'success' });
      setFormData({
        businessName: '',
        contactPerson: '',
        contactPhone: '',
        contactEmail: '',
        message: ''
      });
      setLoading(false); // Set loading to false
    }, (error) => {
      console.log(error.text);
      setNotification({ message: 'Failed to send inquiry. Please try again later.', type: 'error' });
      setLoading(false); // Set loading to false
    });
  };

  const advertisedBusinesses = [
    { id: 1, name: 'Mr. Luke Snack & Coffee', image: businessImage1 },
    { id: 2, name: 'Εν Τέχνο Καφενείο - Ταβέρνα', image: businessImage2 },
    { id: 3, name: 'Business C', image: businessImage1 },
    { id: 4, name: 'Business D', image: businessImage2 },
    { id: 5, name: 'Business E', image: businessImage1 },
    { id: 6, name: 'Business F', image: businessImage2 },
    { id: 7, name: 'Business G', image: businessImage1 },
    { id: 8, name: 'Business H', image: businessImage2 },
    { id: 9, name: 'Business I', image: businessImage1 },
  ];

  useEffect(() => {
    window.scrollTo(0, 0); // Scrolls to the top of the page on component mount
  }, []);

  const scrollToContactForm = () => {
    if (contactFormRef.current) {
      contactFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="advertisement-query-page" style={{marginTop:"7rem",marginBottom:"5rem"}}>
      <div className="banner">
        <img src={advertise} alt="Advertise Banner" />
        <button className="btn primary" onClick={scrollToContactForm}>Learn More</button>
      </div>

      <div className="advertised-businesses">
        <h2>Advertised Businesses</h2>
        <div className="business-grid">
          {advertisedBusinesses.map((business) => (
            <div key={business.id} className="business-card">
              <img src={business.image} alt={business.name} className="business-image" />
              <div className="business-details">
                <h3 className="business-title">{business.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div><br/><br/>

      <div className="contact-form" ref={contactFormRef}>
        <h3>Explore Advertising Opportunities</h3>
        <form ref={formRef} onSubmit={SendEmail}>
          <label htmlFor="businessName">Business Name:</label>
          <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleInputChange} required disabled={loading} />

          <label htmlFor="contactPerson">Contact Person:</label>
          <input type="text" id="contactPerson" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} required disabled={loading} />

          <label htmlFor="contactPhone">Contact Phone:</label>
          <input type="tel" id="contactPhone" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} required disabled={loading} />

          <label htmlFor="contactEmail">Contact Email:</label>
          <input type="email" id="contactEmail" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} required disabled={loading} />

          <label htmlFor="message">Message:</label>
          <textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows="4" required disabled={loading}></textarea>

          <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send Message'}</button>
        </form>
        {notification.message && (
          <p className={notification.type === 'error' ? 'error-message' : 'success-message'}>
            {notification.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default Advertisement;
