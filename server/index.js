const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload = require('express-fileupload');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Import Scheduler
require('./utils/scheduler');

const app = express();

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://okoutsompolis-frontend.onrender.com' // Deployed frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(upload());
app.use('/uploads', express.static(__dirname + '/uploads'));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/subscribers', subscriberRoutes);

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // Redirect all other routes to the React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log(`Server Started on port ${process.env.PORT}`)))
  .catch(error => { console.log(error); });
