import axios from 'axios';

export interface GeminiResponse {
  answer: string;
  history: { role: 'user' | 'model'; text: string }[];
}

/**
 * Ask Gemini for a recommendation.
 * @param prompt - User's question (e.g. "Which fertilizer is best for wheat?")
 * @param history - Optional prior conversation turns to preserve context
 */
export async function askGemini(prompt: string, history: { role: 'user' | 'model'; text: string }[] = []): Promise<GeminiResponse> {
  const response = await axios.post<GeminiResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/gemini`,
    { prompt, history }
  );
  return response.data;
}
