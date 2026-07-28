import { generateArticleAIResponse } from '../services/aiService.js';

const VALID_MODES = ['student_takeaway', 'explain_like_5', 'interview_point'];

export const explainArticle = async (req, res) => {
  try {
    const { title, summary, mode, question, domain } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Article title is required' });
    }

    if (mode && !VALID_MODES.includes(mode)) {
      return res.status(400).json({ message: `mode must be one of: ${VALID_MODES.join(', ')}` });
    }

    const answer = await generateArticleAIResponse({
      title,
      summary,
      mode: mode || 'student_takeaway',
      question,
      domain,
    });

    res.status(200).json({ answer });
  } catch (error) {
    console.error('AI explain error:', error.message);
    res.status(502).json({ message: 'AI response failed' });
  }
};