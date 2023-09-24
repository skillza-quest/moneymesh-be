const express = require('express');
const router = express.Router();
const User = require('../models/Users'); // Import your user model

// Create a new user
router.post('/handleUser', async (req, res) => {
    try {
        const { auth0UserId, username, email } = req.body;
        let user = await User.findOne({ auth0UserId });
        if (!user) {
          user = new User({
            auth0UserId,
            username,
            email,
          });
          await user.save();
        }
        res.json({ userId: user._id });
    } catch (error) {
        console.error('Error handling user:', error);
        res.status(500).json({ message: 'Error handling user' });
    }
  });

module.exports = router;
