const Session = require('../models/session.model');
const Question = require('../models/question.model');

// @desc Create a new session
// @route POST /api/sessions
// @access Private
const createSession = async (req, res) => {
    try {
        const { role, experience, topicsToFocus, description, questions } = req.body;
        const userId = req.user._id;

        const session = new Session({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description
        });

        const questionDocs = await Promise.all(
            questions.map(async (q) => {
                const question = await Question.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer
                });
                return question._id;
            })
        );

        session.questions = questionDocs;
        await session.save();

        res.status(201).json({
            success: true,
            message: "Session created successfully",
            session
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get all sessions for the authenticated user
// @route GET /api/sessions/my-sessions
// @access Private
const getMySessions = async (req, res) => {
    try {
        const sessions = await Session.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .populate("questions");

        res.status(200).json({ success: true, sessions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Get a session by ID with questions
// @route GET /api/sessions/:id
// @access Private
const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate({
                path: "questions",
                options: { sort: { isPinned: -1, createdAt: 1 } }
            })
            .exec();
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        res.status(200).json({ success: true, session });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc Delete a session and its associated questions
// @route DELETE /api/sessions/:id
// @access Private
const deleteSession = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id);
        if (!session) {
            return res.status(404).json({ success: false, message: "Session not found" });
        }

        if (session.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: "Not authorized to delete this session" });
        }

        await Question.deleteMany({ session: session._id });
        await session.deleteOne();

        res.status(200).json({ success: true, message: "Session deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { createSession, getMySessions, getSessionById, deleteSession };