import React, { useEffect, useState, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Authentication/AuthProvider';
import MedicalReport2 from './MedicalReport';
import EnhancedChatbot from './ChatPage';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const ChatDetails = () => {
  const [chat, setChat] = useState(null);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const { chatId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  // Refs for scroll containers
  const medicalReportRef = useRef(null);
  const chatbotRef = useRef(null);

  // Intersection Observer setup for lazy loading
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    };

    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-4');
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, options);
    
    // Observe message containers
    const messageElements = document.querySelectorAll('.message-container');
    messageElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [chat]);

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/chats/${chatId}`);
        if (!response.ok) throw new Error('Failed to fetch chat details');
        const data = await response.json();
        setChat(data);
        setTimeout(() => {
          setIsVisible(true);
          scrollToBottom('medical-report-scroll');
          scrollToBottom('chatbot-scroll');
        }, 100);
      } catch (error) {
        console.error('Error fetching chat details:', error);
        setError(error.message);
      }
    };

    if (chatId) {
      fetchChatDetails();
    }
  }, [chatId]);

  // Enhanced scroll to bottom function with smooth behavior
  const scrollToBottom = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollTo({
        top: element.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  // Handle scroll sync between panels
  const handleScroll = (sourceRef, targetRef) => {
    if (!sourceRef.current || !targetRef.current) return;
    
    const sourceElement = sourceRef.current;
    const targetElement = targetRef.current;
    
    const scrollPercentage = 
      sourceElement.scrollTop / 
      (sourceElement.scrollHeight - sourceElement.clientHeight);
    
    targetElement.scrollTop = 
      scrollPercentage * 
      (targetElement.scrollHeight - targetElement.clientHeight);
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded animate-fade-in">
          <p className="text-red-700 text-sm font-poppins">{error}</p>
        </div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-6 w-6 animate-spin text-[#4DA1A9]" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 font-poppins">
      {/* Header */}
      <div className={`flex-none bg-white border-b border-gray-100 shadow-sm transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
        <div className="container mx-auto px-4 py-3">
          <button
            onClick={() => navigate('/home/chats')}
            className="flex items-center text-[#4DA1A9] hover:text-[#79D7BE] transition-all duration-300 text-sm hover:scale-105"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Chats
          </button>
          <div className="mt-2">
            <h1 className="text-xl font-exo font-semibold text-gray-800">
              {chat.title}
            </h1>
            <div className="flex items-center mt-1 text-xs text-gray-500">
              <Clock className="mr-1.5 h-3.5 w-3.5" />
              <span>Created on {format(new Date(chat.createdAt), 'MMMM dd, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden container mx-auto px-4 py-4">
        <div className={`grid grid-cols-2 gap-4 h-full transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Medical Report Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="flex-none p-3 bg-gradient-to-r from-[#4DA1A9] to-[#79D7BE] border-b">
              <h2 className="text-sm font-exo font-semibold text-white">Medical Report</h2>
            </div>
            <div 
              id="medical-report-scroll"
              ref={medicalReportRef}
              onScroll={() => handleScroll(medicalReportRef, chatbotRef)}
              className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent"
            >
              {chat.messages.map((message, index) => (
                <div 
                  key={`report-${index}`} 
                  className="message-container mb-3 transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm opacity-0 translate-y-4"
                >
                  <MedicalReport2 report={message.content} />
                </div>
              ))}
            </div>
          </div>

          {/* Chatbot Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col">
            <div className="flex-none p-3 bg-gradient-to-r from-[#4DA1A9] to-[#79D7BE] border-b">
              <h2 className="text-sm font-exo font-semibold text-white">AI Assistant</h2>
            </div>
            <div 
              id="chatbot-scroll"
              ref={chatbotRef}
              onScroll={() => handleScroll(chatbotRef, medicalReportRef)}
              className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-gray-200 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent"
            >
              {chat.messages.map((message, index) => (
                <div 
                  key={`chat-${index}`} 
                  className="message-container mb-3 transform transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm opacity-0 translate-y-4"
                >
                  <EnhancedChatbot report={message.content} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;