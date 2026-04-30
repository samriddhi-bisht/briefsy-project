import { generateArticleAIResponse } from '../services/aiService.js';

export const explainArticle = async (req, res) => {
  try {
    const { title, summary, mode, question, domain } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Article title is required' });
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
    res.status(500).json({
      message: 'AI response failed',
      error: error.message,
    });
  }
};