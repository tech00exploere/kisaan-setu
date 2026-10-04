import axiosInstance from '@/lib/axios';

export interface GeminiResponse {
  reply: string;
  answer: string;
  history: { role: 'user' | 'model'; text: string }[];
}

/**
 * Ask Gemini AI for recommendations.
 * @param prompt - User's question (e.g. "Which crop should I consider selling?")
 * @param history - Optional prior conversation history
 */
export async function askGemini(
  prompt: string,
  history: { role: 'user' | 'model'; text: string }[] = []
): Promise<GeminiResponse> {
  const response = await axiosInstance.post<{
    reply?: string;
    answer?: string;
    history?: { role: 'user' | 'model'; text: string }[];
  }>('/gemini', { prompt, history });

  const replyText = response.data?.reply || response.data?.answer || '';
  const updatedHistory = response.data?.history || [
    ...history,
    { role: 'user' as const, text: prompt },
    { role: 'model' as const, text: replyText },
  ];

  return {
    reply: replyText,
    answer: replyText,
    history: updatedHistory,
  };
}
