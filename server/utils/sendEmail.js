const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'okoutsompolis.contact@gmail.com',
    pass: 'cftd muam cfka ntlj',
  },
});

const mailOptions = {
  from: 'okoutsompolis.contact@gmail.com',
  to: 'balaskas1911@gmail.com',
  subject: 'Test Email',
  text: 'This is a test email.',
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
