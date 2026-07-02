"use client";

import { useState } from 'react';
import { askGemini, GeminiResponse } from '@/services/gemini.service';

export default function FertilizerRecommender() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ role: 'user' | 'model'; text: string }[]>([]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const { answer: respAnswer, history: newHistory } = await askGemini(question, history);
      setAnswer(respAnswer);
      setHistory(newHistory);
    } catch (err) {
      console.error('Gemini request failed', err);
      setAnswer('Error contacting AI. Please try again later.');
    } finally {
      setLoading(false);
      setQuestion('');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        rows={3}
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        placeholder="e.g. ‘Which N‑PK fertilizer is best for my wheat crop in Punjab?’"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        disabled={loading}
      />

      <button
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        onClick={handleAsk}
        disabled={loading}
      >
        {loading ? 'Thinking…' : 'Ask Gemini'}
      </button>

      {answer && (
        <div className="mt-4 p-4 bg-gray-50 border rounded">
          <h3 className="font-medium mb-2 text-gray-800">💡 Recommendation</h3>
          <p className="whitespace-pre-line text-gray-700">{answer}</p>
        </div>
      )}
    </div>
  );
}
