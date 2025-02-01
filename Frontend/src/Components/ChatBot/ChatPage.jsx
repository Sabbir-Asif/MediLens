import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { MessageSquare, Send, Trash2, Sparkles, Bot, User, Settings, Download, Share2 } from 'lucide-react';

const SAFETY_SETTINGS = [
  {
    category: "HARM_CATEGORY_SEXUAL",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_HARASSMENT",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_HATE_SPEECH",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
    threshold: "BLOCK_ONLY_HIGH",
  },
  {
    category: "HARM_CATEGORY_DANGEROUS_CONTENT",
    threshold: "BLOCK_ONLY_HIGH",
  },
];


export default function EnhancedChatbot(props) {
  const info = props.report;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const API_KEY = "AIzaSyBXwV9V-IBKqnBMEryEvbKA0OXp43VDr3I";
  const BANGLA_SYSTEM_PROMPT = `You are a helpful Bangla-speaking assistant. Always respond in Bangla (Bengali) language using Bengali script. Keep your responses natural and conversational, as if speaking to a Bengali speaker. If you need to include technical terms or English words, write them in Bengali script phonetically when possible. Never switch to English or any other language unless specifically asked. Even if the user writes in English, always respond in Bangla. And you give reponse in one paragraph, and don't use anything like bold, undeline or others things.You will keep in mind about the following info ${info}, and when giving answer consider these info's(specially the person name)`;

  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-002' });
  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initChat = async () => {
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 1000,
        },
      });
      await chat.sendMessage(BANGLA_SYSTEM_PROMPT);
      chatRef.current = chat;
    };
    initChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const clearChat = async () => {
    setMessages([]);
    setCurrentResponse('');
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
    await chat.sendMessage(BANGLA_SYSTEM_PROMPT);
    chatRef.current = chat;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);
    setCurrentResponse('ভাবছি...');

    try {
      const result = await chatRef.current.sendMessage(userMessage, {
        safetySettings: SAFETY_SETTINGS
      });

      setCurrentResponse('');
      let fullResponse = '';
      
      const response = await result.response;
      const text = response.text();
      const words = text.split('');
      
      for (let i = 0; i < words.length; i++) {
        fullResponse += words[i];
        setCurrentResponse(fullResponse + '▋');
        if (i % Math.floor(Math.random() * (10 - 5 + 1) + 5) === 0) {
          await sleep(50);
        }
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
      setCurrentResponse('');

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'দুঃখিত, একটি ত্রুটি হয়েছে। আবার চেষ্টা করুন।'
      }]);
      setCurrentResponse('');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadChat = () => {
    const chatContent = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bangla-chat.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareChat = () => {
    if (navigator.share) {
      navigator.share({
        title: 'বাংলা চ্যাটবট কথোপকথন',
        text: messages
          .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
          .join('\n\n'),
      });
    }
  };

  return (
    <div className="flex w-full flex-col h-[calc(100vh-200px)] bg-gradient-to-br from-[#F8FDFF] via-white to-[#E8F7FA] font-poppins">

      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-[#4DA1A9]/10 bg-white/90 px-6 py-3 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-r from-[#4DA1A9] to-[#79D7BE] shadow-lg">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-800 font-exo">বাংলা চ্যাটবট</h1>
            <div className="flex items-center gap-2">
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#4DA1A9]" />
              <p className="text-xs text-gray-500">অনলাইন</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={downloadChat}
            className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition-all hover:bg-gray-100"
          >
            <Download className="h-3.5 w-3.5" />
            সংরক্ষণ
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition-all hover:bg-gray-100"
          >
            <Settings className="h-3.5 w-3.5" />
            সেটিংস
          </button>
          
          <button
            onClick={clearChat}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs text-red-500 transition-all hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            মুছুন
          </button>
        </div>
        
        {showSettings && (
          <div className="absolute right-6 top-14 z-10 w-56 rounded-xl bg-white p-3 shadow-xl ring-1 ring-gray-100">
            <h3 className="mb-2 text-xs font-medium text-gray-700">সেটিংস</h3>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" className="rounded text-[#4DA1A9]" />
                টাইপিং অ্যানিমেশন
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <input type="checkbox" className="rounded text-[#4DA1A9]" />
                অটো-স্ক্রল
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-end gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4DA1A9]/10">
                  <Bot className="h-4 w-4 text-[#4DA1A9]" />
                </div>
              )}
              
              <div
                className={`group relative max-w-xl rounded-2xl px-3 py-2 text-sm ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-[#4DA1A9] to-[#79D7BE] text-white'
                    : 'bg-white text-gray-700 shadow-sm ring-1 ring-gray-100'
                } ${message.role === 'assistant' ? 'rounded-bl-none' : 'rounded-br-none'}`}
              >
                {message.content}
              </div>
              
              {message.role === 'user' && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4DA1A9]">
                  <User className="h-4 w-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {currentResponse && (
            <div className="flex items-end gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#4DA1A9]/10">
                <Bot className="h-4 w-4 text-[#4DA1A9]" />
              </div>
              <div className="relative max-w-xl rounded-2xl rounded-bl-none bg-white px-3 py-2 text-sm text-gray-700 shadow-sm ring-1 ring-gray-100">
                {currentResponse}
                <div className="absolute -bottom-5 flex items-center gap-1 text-xs text-gray-400">
                  <Sparkles className="h-3 w-3" />
                  টাইপিং...
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-[#4DA1A9]/10 bg-white/90 px-6 py-3 backdrop-blur-lg">
        <form onSubmit={handleSubmit} className="mx-auto">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="আপনার বার্তা লিখুন..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm placeholder:text-gray-400 focus:border-[#4DA1A9] focus:outline-none focus:ring-2 focus:ring-[#4DA1A9]/20"
                disabled={isLoading}
              />
              {isLoading && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <Sparkles className="h-4 w-4 animate-spin text-[#4DA1A9]" />
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[#4DA1A9] to-[#79D7BE] px-4 py-2 text-sm text-white shadow-sm transition-all hover:brightness-105 disabled:opacity-50"
            >
              <span>পাঠান</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}