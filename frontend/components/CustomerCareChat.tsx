"use client";

import { useState } from "react";
import { askGemini } from "@/services/gemini.service";

interface Message {
  role: "user" | "model";
  text: string;
}

export default function CustomerCareChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    try {
      const { answer, history } = await askGemini(input, messages);
      const aiMsg: Message = { role: "model", text: answer };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: Message = { role: "model", text: "Sorry, I couldn't process your request. Please try again later." };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <section className="flex flex-col h-screen p-4 bg-gradient-to-b from-green-50 to-white">
      <h1 className="text-2xl font-semibold text-center text-green-800 mb-4">
        🤖 Customer Care Assistant
      </h1>
      <div className="flex-1 overflow-y-auto space-y-3 p-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-md rounded-lg p-3 text-sm ${{
                user: "bg-green-600 text-white",
                model: "bg-gray-200 text-gray-800",
              }[msg.role]}`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 text-gray-800 rounded-lg p-3 text-sm animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex gap-2">
        <textarea
          rows={1}
          className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Ask a question…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          disabled={loading}
        />
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </section>
  );
}
