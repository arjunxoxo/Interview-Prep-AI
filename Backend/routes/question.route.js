const express = require('express');
const { addQuestionToSession, togglePinQuestion, updateQuestionNote } = require('../controllers/question.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

router.post('/add', protect, addQuestionToSession); // Add a new question to a session
router.post('/:id/pin', protect, togglePinQuestion); // Pin or unpin a question
router.post('/:id/note', protect, updateQuestionNote); // Update a note in a question

module.exports = router; 