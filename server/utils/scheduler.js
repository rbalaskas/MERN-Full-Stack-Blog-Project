// utils/scheduler.js

const cron = require('node-cron');
const User = require('../models/userModel');
let leaderboardCache = [];

// Function to update leaderboard cache
const updateLeaderboard = async () => {
  try {
    // Fetch and sort users based on totalPoints
    const users = await User.find();
    const sortedUsers = users.sort((a, b) => b.totalPoints - a.totalPoints).slice(0, 10);

    // Update the leaderboard cache
    leaderboardCache = sortedUsers;
    console.log('Updated Leaderboard Cache:', leaderboardCache);
    console.log('Leaderboard updated successfully.');
  } catch (error) {
    console.error('Error updating leaderboard:', error);
  }
};

// Schedule the job to run every day at midnight
cron.schedule('0 0 * * *', updateLeaderboard);

// Initial update when server starts
updateLeaderboard();

// Export the cache and function
module.exports = {
  getLeaderboard: () => leaderboardCache,
  updateLeaderboard,
};
