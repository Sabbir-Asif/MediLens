import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../Authentication/AuthProvider';
import { ArrowLeft, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const ChatDetails = () => {
  const [chat, setChat] = useState(null);
  const { chatId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = user?.id;

  useEffect(() => {
    const fetchChatDetails = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/chats/${chatId}`);
        const data = await response.json();
        setChat(data);
      } catch (error) {
        console.error('Error fetching chat details:', error);
      }
    };

    if (chatId) {
      fetchChatDetails();
    }
  }, [chatId]);

  if (!chat) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 font-poppins">
      <button 
        onClick={() => navigate('/home/chats')}
        className="mb-6 flex items-center text-orange-primary hover:text-orange-secondary transition-colors duration-300"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Chats
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="border-b border-orange-secondary pb-4 mb-6">
          <h1 className="text-2xl font-bold text-orange-primary">{chat.title}</h1>
          <div className="flex items-center mt-2 text-sm text-gray-600">
            <Clock size={16} className="mr-2 text-orange-secondary" />
            <span>Created on {format(new Date(chat.createdAt), 'MMMM dd, yyyy')}</span>
          </div>
        </div>

        <div className="space-y-4">
          {chat.messages.map((message, index) => (
            <div 
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[70%] p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-orange-primary text-white' 
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span className="text-xs mt-2 block opacity-75">
                  {format(new Date(message.timestamp), 'HH:mm')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatDetails;