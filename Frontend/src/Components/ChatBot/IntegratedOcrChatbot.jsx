import React, { useState, useRef, useEffect, useContext } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Tesseract from 'tesseract.js';
import { 
  MessageSquare, Send, Trash2, Sparkles, Bot, User, 
  Settings, Download, Share2, Upload, File, Loader2 
} from 'lucide-react';
import pdfToText from 'react-pdftotext';
import MedicalReport2 from './MedicalReport';
import { AuthContext } from '../Authentication/AuthProvider';
import axios from 'axios';

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

const SYSTEM_PROMPT = `You are a medical assistant specializing in Bengali (Bangla) medical communication. 
When analyzing medical documents or text, ALWAYS respond with a valid JSON object in the following structure:

{
  "রোগীর_তথ্য": {
    "শিরোনাম": "রোগীর বিবরণ",
    "বিবরণ": "রোগীর নাম, বয়স, তারিখ ইত্যাদি"
  },
  "স্বাস্থ্য_পরীক্ষা": {
    "শিরোনাম": "স্বাস্থ্য পরীক্ষার ফলাফল",
    "বিভাগসমূহ": [
      {
        "শিরোনাম": "ভাইটাল সাইন",
        "বিবরণ": "রক্তচাপ, হার্ট রেট ইত্যাদি"
      },
      {
        "শিরোনাম": "পরীক্ষার ফলাফল",
        "বিবরণ": "রক্ত পরীক্ষা ইত্যাদি"
      },
      {
        "শিরোনাম": "রোগ নির্ণয়",
        "বিবরণ": "চিকিৎসকের মতামত"
      }
    ]
  },
  "চিকিৎসা_পরিভাষা": [
    {
      "পরিভাষা": "মেডিকেল টার্ম",
      "ব্যাখ্যা": "বাংলায় বিস্তারিত ব্যাখ্যা"
    }
  ],
  "গুরুত্বপূর্ণ_তথ্য": [
    {
      "তথ্য": "প্রধান তথ্য",
      "পরামর্শ": "চিকিৎসকের পরামর্শ"
    }
  ]
}`;

export default function IntegratedOcrChatbot() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState('');
  const [currentReport, setCurrentReport] = useState(null);
  const [showChatHistory, setShowChatHistory] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);

  const API_KEY = "AIzaSyBXwV9V-IBKqnBMEryEvbKA0OXp43VDr3I";
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-002' });

  const chatRef = useRef(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const { user } = useContext(AuthContext);
  const userId = user?.id;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const initChat = async () => {
      const chat = model.startChat({
        history: [],
        generationConfig: {
          maxOutputTokens: 2000,
        },
      });
      await chat.sendMessage(SYSTEM_PROMPT);
      chatRef.current = chat;
    };
    initChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setOcrResult('');

    if (!file) return;

    try {
      setIsLoading(true);
      let extractedText = '';

      if (file.type === 'application/pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (file.type.startsWith('image/')) {
        extractedText = await performOcr(file);
      } else {
        throw new Error('Unsupported file type');
      }

      setOcrResult(extractedText);
      setInputMessage(extractedText);
      handleSubmit(null, extractedText);
    } catch (error) {
      console.error('File Processing Error:', error);
      alert('Failed to process the file');
    } finally {
      setIsLoading(false);
    }
  };

  const performOcr = async (file) => {
    return new Promise((resolve, reject) => {
      Tesseract.recognize(
        file,
        'eng',
        { 
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        }
      )
      .then(({ data: { text } }) => {
        resolve(text);
      })
      .catch(reject);
    });
  };

  const extractTextFromPDF = async (file) => {
    return new Promise((resolve, reject) => {
      pdfToText(file)
        .then((extractedText) => resolve(extractedText))
        .catch((err) => {
          console.error('PDF Text Extraction Error:', err);
          reject(err);
        });
    });
  };

  const clearChat = async () => {
    setMessages([]);
    setCurrentResponse('');
    setOcrResult('');
    setSelectedFile(null);
    setCurrentChatId(null);
    const chat = model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });
    await chat.sendMessage(SYSTEM_PROMPT);
    chatRef.current = chat;
  };

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const handleSubmit = async (e, preloadedText = null) => {
    e?.preventDefault();
    const messageContent = preloadedText || inputMessage;

    if (!messageContent.trim() || isLoading) return;

    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: messageContent }]);
    setIsLoading(true);
    setCurrentResponse('ভাবছি...');
    setCurrentReport(null);

    try {
      const result = await chatRef.current.sendMessage(
        `Process this medical text and provide a detailed explanation in Bangla and English: ${messageContent}`, 
        { safetySettings: SAFETY_SETTINGS }
      );

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

      try {
        const jsonMatch = fullResponse.match(/```json\s*(.*?)\s*```/s) || fullResponse.match(/json\s*(.*)/s);
        if (jsonMatch) {
          const reportData = JSON.parse(jsonMatch[1]);
          setCurrentReport(reportData);
        }
      } catch (error) {
        console.error('Failed to parse JSON from response:', error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
      setCurrentResponse('');

      // Save the chat to the backend
      if (userId) {
        const chatData = {
          userId,
          title: `Chat ${new Date().toLocaleString()}`, // You can customize the title
          messages: [...messages, { role: 'user', content: messageContent }, { role: 'assistant', content: fullResponse }]
        };

        if (currentChatId) {
          await axios.patch(`/api/chats/${currentChatId}`, chatData);
        } else {
          const response = await axios.post('/api/chats/', chatData);
          setCurrentChatId(response.data.id);
        }
      }
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

  const handleChatSelect = (chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setShowChatHistory(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setShowChatHistory(false);
  };

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-[#FFF7F4] via-white to-[#FFF0E9]">
      {/* Chat History Sidebar */}
      {showChatHistory && (
        <div className="w-80 border-r bg-white">
          <ChatHistory 
            userId={userId} 
            onChatSelect={handleChatSelect} 
            onNewChat={handleNewChat} 
          />
        </div>
      )}

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="relative flex items-center justify-between border-b bg-white/80 px-8 py-4 backdrop-blur-lg">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowChatHistory(!showChatHistory)}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 shadow-lg"
            >
              <MessageSquare className="h-6 w-6 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Medical OCR Chatbot</h1>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
                <p className="text-sm text-gray-600">Google Gemini & Tesseract OCR</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*,application/pdf"
              className="hidden" 
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 rounded-lg bg-blue-50 px-4 py-2 text-blue-700 transition-all hover:bg-blue-100"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </button>
            
            <button
              onClick={clearChat}
              className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 text-red-600 transition-all hover:bg-red-100"
            >
              <Trash2 className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="mx-auto space-y-6">
            {/* OCR Progress & Result Section */}
            {isLoading && selectedFile && (
              <div className="mb-4 rounded-lg bg-gray-100 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span>{selectedFile.name}</span>
                  <span>{ocrProgress}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-gray-200">
                  <div 
                    className="h-2.5 rounded-full bg-blue-600" 
                    style={{width: `${ocrProgress}%`}}
                  ></div>
                </div>
              </div>
            )}

            {/* Messages Section */}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-end gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                    <Bot className="h-5 w-5 text-orange-600" />
                  </div>
                )}
                
                <div
                  className={`group relative max-w-2xl rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                      : 'bg-white text-gray-800 shadow-sm'
                  } ${message.role === 'assistant' ? 'rounded-bl-none' : 'rounded-br-none'}`}
                >
                  {index == 0 ? (message.role === 'user' ? "document uploaded" : <MedicalReport2 report={message.content} />) : (message.role === 'user' ? message.content : <MedicalReport2 report={message.content} />)}
                </div>
                
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500">
                    <User className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {currentResponse && (
              <div className="flex items-end gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100">
                  <Bot className="h-5 w-5 text-orange-600" />
                </div>
                <div className="relative max-w-2xl rounded-2xl rounded-bl-none bg-white px-4 py-3 text-gray-800 shadow-sm">
                  {currentResponse}
                  <div className="absolute -bottom-6 flex items-center gap-1 text-xs text-gray-400">
                    <Sparkles className="h-3 w-3" />
                    Analyzing...
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="border-t bg-white/80 px-8 py-4 backdrop-blur-lg">
          <form onSubmit={handleSubmit} className="mx-auto">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question about the document..."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  disabled={isLoading}
                />
                {isLoading && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Sparkles className="h-5 w-5 animate-spin text-orange-500" />
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-8 py-3 text-white shadow-sm transition-all hover:brightness-110 disabled:opacity-50"
              >
                <span>Send</span>
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}