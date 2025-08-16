const Question = require('../models/question.model');
const Session = require('../models/session.model');

// @desc   add a new question to a session
// @route  POST /api/questions/add
// @access Private
const addQuestionToSession = async (req, res) => {
    try{
        const { sessionId, questions } = req.body;

        if(!sessionId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({ success: false, message: 'Invalid input data' });
        }

        const session = await Session.findById(sessionId);
        if (!session) {
            return res.status(404).json({ success: false, message: 'Session not found' });
        }
        // Create new questions

        const createdQuestions = await Question.insertMany(
            questions.map(q => ({
                session: sessionId,
                question: q.question,
                answer: q.answer,
            }))
        );

        session.questions.push(...createdQuestions.map(q => q._id));
        await session.save();

        res.status(201).json(createdQuestions);
    }catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

// @desc   pin or unpin a question in a session
// @route  POST /api/questions/:id/pin
// @access Private
const togglePinQuestion = async (req, res) => {
    try{
        const question = await Question.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        question.isPinned = !question.isPinned;
        await question.save();

        res.status(200).json({ success: true, message: 'Question pin status updated', question });
    }catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

// @desc   update a note in a question
// @route  PUT /api/questions/:id/note
// @access Private
const updateQuestionNote = async (req, res) => {
    try{
        const { note } = req.body;
        const question = await Question.findById(req.params.id);

        if (!question) {
            return res.status(404).json({ success: false, message: 'Question not found' });
        }

        question.note = note || '';
        await question.save();

        res.status(200).json({ success: true, message: 'Question note updated', question });
    }catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
}

module.exports = { addQuestionToSession, togglePinQuestion, updateQuestionNote };