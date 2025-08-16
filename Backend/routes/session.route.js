const express = require('express');
const { createSession, getMySessions, getSessionById, deleteSession } = require('../controllers/session.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/create', protect, createSession); // Create a new session
router.get('/my-sessions', protect, getMySessions); // Get all sessions for the authenticated user
router.get('/:id', protect, getSessionById); // Get a session by ID with questions
router.delete('/:id', protect, deleteSession); // Delete a session by ID

module.exports = router;