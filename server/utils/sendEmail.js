// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', 'yahoo', etc.
  auth: {
    user: 'okoutsompolis.contact@gmail.com',
    pass: 'cftd muam cfka ntlj',
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: 'okoutsompolis.contact@gmail.com',
    to: 'balaskas1911@gmail.com',
    subject: 'Test Email',
    text: 'This is a test email.',
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

module.exports = sendEmail;
