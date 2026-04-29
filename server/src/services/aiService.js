import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateArticleAIResponse = async ({ title, summary, mode, question, domain }) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is missing');
  }

  const prompt = `
You are Briefsy, an AI news companion for students.

Article title:
${title}

Article summary:
${summary || 'No summary available'}

Student domain:
${domain || 'general'}

Mode:
${mode}

Question:
${question || 'Explain this article in a useful way'}

Rules:
- Use only the given article title and summary.
- Do not invent facts.
- Keep answer short, clear, and useful.
- If mode is explain_like_5, explain simply.
- If mode is student_takeaway, give student relevance.
- If mode is interview_point, give 2-3 talking points.
`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.4,
  });

  return completion.choices[0].message.content;
};