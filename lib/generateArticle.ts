import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generate an original, detailed article body for a collector news item.
 * Used when we can't extract a substantial body from the source — guarantees
 * readers get real, relatable detail instead of just a headline.
 * Returns plain-text paragraphs (blank-line separated), or null on failure.
 */
export async function generateArticleBody(
  title: string,
  category: string,
  snippet: string,
  sourceName: string
): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) return null;
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `You are a senior writer for "The Collector's Pulse", a premium news site for collectors of trading cards, anime figures, and luxury watches.

Write an original, engaging news article of 4 short paragraphs (about 260-340 words total) based on the information below. Be specific and informative so a collector learns something useful (what it is, why it matters, what to watch for). Do NOT invent exact prices, dates, or quotes that aren't given. Write in a confident editorial voice. Return ONLY the article body as plain-text paragraphs separated by blank lines — no title, no headings, no markdown.

Category: ${category}
Headline: ${title}
Known details: ${snippet || '(only the headline is available)'}
Source: ${sourceName}`;

    const result = await model.generateContent(prompt);
    const text = (result.response.text() || '').trim();
    return text.length > 120 ? text : null;
  } catch {
    return null;
  }
}
