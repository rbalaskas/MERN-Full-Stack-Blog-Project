// utils/sendEmail.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail', 'yahoo', etc.
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
