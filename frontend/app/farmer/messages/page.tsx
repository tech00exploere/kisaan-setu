"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import './messages.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  image?: string; // Data URL for rendering attached images in chat bubble
  audio?: string; // Data URL for rendering voice recordings in chat bubble
}

interface Attachment {
  name: string;
  mimeType: string;
  data: string; // Base64 data string
  previewUrl: string; // Data URL for previews
  type: 'image' | 'audio';
}


export default function MessagesPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [recording, setRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat history window to bottom when messages list updates
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const getFormattedTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Image Upload File Handler
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAttachment({
        name: file.name,
        mimeType: file.type,
        data: base64String,
        previewUrl: base64String,
        type: 'image'
      });
    };
  };

  // Voice Mic Recording Handlers
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64Audio = reader.result as string;
          setAttachment({
            name: 'Voice Note.webm',
            mimeType: 'audio/webm',
            data: base64Audio,
            previewUrl: base64Audio,
            type: 'audio'
          });
        };
        stream.getTracks().forEach(track => track.stop());
      };

      recorderRef.current = recorder;
      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error('Microphone access failed:', err);
      alert('Could not access microphone. Please check browser permissions.');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current && recording) {
      recorderRef.current.stop();
      setRecording(false);
    }
  };

  const toggleRecording = () => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Send Message handler
  const sendMessage = async (customInput?: string) => {
    const textToSend = customInput || input;
    // We allow sending if there is text OR if there is an attachment
    if (!textToSend.trim() && !attachment) return;

    const time = getFormattedTime();
    
    // Construct message object for user's text bubble
    const userMsg: Message = {
      role: 'user',
      content: textToSend || (attachment?.type === 'image' ? 'Image uploaded' : 'Voice Memo'),
      timestamp: time,
      image: attachment?.type === 'image' ? attachment.previewUrl : undefined,
      audio: attachment?.type === 'audio' ? attachment.previewUrl : undefined
    };

    // Keep reference of current attachment and immediately clear from active previews
    const activeAttachment = attachment;
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setAttachment(null);
    setLoading(true);

    // Format prompt instructions to system
    const systemInstruction = `[Context: You are the Kisaan AI Assistant. Give highly accurate agricultural, crop, fertilizer, weather, and mandi market advice. Make sure your response formatting is clean and easy to read. If an image is attached, describe the diagnostics. If audio is attached, treat it as voice query.]`;
    const promptWithContext = `${systemInstruction} ${textToSend || 'Please analyze this attachment.'}`;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/gemini`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptWithContext,
          history: messages.map(m => ({ role: m.role, content: m.content })),
          attachment: activeAttachment ? {
            mimeType: activeAttachment.mimeType,
            data: activeAttachment.data
          } : undefined
        })
      });

      const data = await res.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.reply ?? 'No response received. Please try again.',
        timestamp: getFormattedTime()
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Could not connect to service. Please check your internet connection.',
          timestamp: getFormattedTime()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat-main">
        {/* Header */}
        <div className="chat-header">
          <div className="header-meta">
            <button 
              onClick={() => router.back()} 
              className="mr-3 p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4 text-slate-700" />
            </button>
            <div className="avatar-container">
              {/* High-fidelity generated Kisaan AI Assistant avatar */}
              <img
                src="/images/kisaan_avatar.png"
                alt="Kisaan Assistant Avatar"
                className="avatar"
              />
              <span className="status-indicator" />
            </div>
            <div className="header-title-container">
              <span className="header-name">Kisaan AI Assistant</span>
              <span className="header-status">Online & Active</span>
            </div>
          </div>
          <button className="btn-clear" onClick={() => setMessages([])}>
            Clear Chat
          </button>
        </div>

        {/* Conversation Scroll Window */}
        <div className="chat-window" ref={chatWindowRef}>
          {messages.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#374151', textAlign: 'center', padding: '2rem' }}>
              <div style={{ background: '#e9f5ed', borderRadius: '50%', padding: '1rem', marginBottom: '1.25rem' }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#1b4332" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h4 style={{ color: '#0f291e', fontWeight: 700, fontSize: '1.2rem', marginBottom: '0.4rem' }}>Welcome to Kisaan AI</h4>
              <p style={{ fontSize: '0.92rem', color: '#4b5563', maxWidth: '380px', lineHeight: '1.4' }}>
                Ask me about crops, pests, market prices, or soils. You can also upload photos of diseased crops or ask voice queries directly!
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`msg-wrapper ${msg.role}`}>
                <div className="msg">
                  {msg.image && (
                    <img src={msg.image} className="message-image" alt="User upload" />
                  )}
                  {msg.audio && (
                    <div style={{ marginBottom: '0.5rem' }}>
                      <audio src={msg.audio} controls style={{ maxWidth: '100%' }} />
                    </div>
                  )}
                  {msg.content}
                </div>
                <span className="msg-meta">{msg.timestamp}</span>
              </div>
            ))
          )}
          {loading && (
            <div className="msg-wrapper assistant">
              <div className="typing-bubble">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}
        </div>

        {/* Active Attachment Preview Panel (Shown just above input field) */}
        {attachment && (
          <div className="attachment-preview-panel">
            <div className="attachment-preview-card">
              {attachment.type === 'image' ? (
                <img src={attachment.previewUrl} alt="Attached thumbnail" />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', background: '#fee2e2', borderRadius: '6px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m-6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                </div>
              )}
              <span className="attachment-preview-name">{attachment.name}</span>
              <button className="btn-remove-attachment" onClick={() => setAttachment(null)}>
                &times;
              </button>
            </div>
          </div>
        )}


        {/* Input Panel */}
        <div className="input-panel">
          <div className="input-area">
            {/* Hidden Input for Images */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              style={{ display: 'none' }}
            />

            {/* Image Upload Trigger */}
            <button
              className="btn-action"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading || recording}
              title="Upload crop image"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </button>

            {/* Mic Toggle Trigger */}
            <button
              className={`btn-action ${recording ? 'active-record' : ''}`}
              onClick={toggleRecording}
              disabled={loading}
              title={recording ? "Stop recording" : "Record voice query"}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />
              </svg>
            </button>

            {recording ? (
              <div className="recording-bar">
                <span className="recording-dot" />
                <span>Recording voice query... Speak now. Click mic button to stop.</span>
              </div>
            ) : (
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Ask Kisaan AI Assistant..."
                disabled={loading}
              />
            )}

            <button
              className="btn-send"
              onClick={() => sendMessage()}
              disabled={loading || recording || (!input.trim() && !attachment)}
            >
              <svg viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
