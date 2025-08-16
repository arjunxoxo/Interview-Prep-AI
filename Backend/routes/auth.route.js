const express = require('express');
const { registerUser, loginUser , getUserProfile } = require('../controllers/auth.controller');
const {protect} = require('../middlewares/auth.middleware');
const router = express.Router();

// Authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;