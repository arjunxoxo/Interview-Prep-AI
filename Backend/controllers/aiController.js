const {GoogleGenAI} = require('@google/genai');
const {conceptExplainPrompt,questionAnswerPrompt}=require("../utils/prompts");

const ai=new GoogleGenAI({ apiKey : process.env.GEMINI_API_KEY });

// @desc   Generate interview questions and answers using Gemini AI
// @route  POST /api/ai/generate-questions
// @access Private
const generateInterviewQuestions = async (req, res) => {
    try{
        const{ role, experience, topicsToFocus, numberOfQuestions } = req.body; 
        if (!role || !experience || !topicsToFocus || !numberOfQuestions) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const prompt = questionAnswerPrompt(role, experience, topicsToFocus, numberOfQuestions);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        let rawText = response.text;
        // clean it : Remove ```json and ``` from the start and end
        const cleanedText = rawText
        .replace(/^```json\s*/, "") // Remove ```json at the start
        .replace(/```$/, "") // Remove ``` at the end
        .trim(); // Trim any extra whitespace
        // now safe to parse
        const data=JSON.parse(cleanedText);
        res.status(200).json({ success: true, data });
    }catch (error) {
        console.error('Error generating interview questions:', error);
        res.status(500).json({ success: false, message: 'Failed to generate interview questions', error: error.message });
    }
}

// @desc   Generate concept explanation using Gemini AI
// @route  POST /api/ai/generate-explanation
// @access Private
const generateConceptExplanation = async (req, res) => {
    try{
        const { question } = req.body;
        if (!question) {
            return res.status(400).json({ success: false, message: 'Question is required' });
        }
        const prompt= conceptExplainPrompt(question);
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
        });
        let rawText = response.text;
        // clean it : Remove ```json and ``` from the start and end
        const cleanedText = rawText
        .replace(/^```json\s*/, "") // Remove ```json at the start
        .replace(/```$/, "") // Remove ``` at the end
        .trim(); // Trim any extra whitespace
        // now safe to parse
        const data = JSON.parse(cleanedText);
        res.status(200).json({ success: true, data });
    }catch (error) {
        console.error('Error generating concept explanation:', error);
        res.status(500).json({ success: false, message: 'Failed to generate concept explanation', error: error.message });
    }
}

module.exports = { generateInterviewQuestions , generateConceptExplanation };

