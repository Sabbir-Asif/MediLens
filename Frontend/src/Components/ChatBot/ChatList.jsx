import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Authentication/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/chats/user/${userId}`);
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Error fetching chats:', error);
      }
    };

    if (userId) {
      fetchChats();
    }
  }, [userId]);

  const handleViewChat = (chatId) => {
    navigate(`/home/chat/${chatId}`);
  };

  return (
    <div className="container mx-auto p-6 font-poppins">
      <h1 className="text-3xl font-bold mb-8 text-orange-primary">Your Conversations</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chats.map((chat) => (
          <div 
            key={chat.id} 
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-orange-secondary"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-orange-primary truncate">
                  {chat.title}
                </h2>
                <MessageSquare className="text-cream-primary" size={24} />
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-orange-secondary" />
                  <span>Last updated: {format(new Date(chat.updatedAt), 'MMM dd, yyyy HH:mm')}</span>
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-2 text-orange-secondary" />
                  <span>Created: {format(new Date(chat.createdAt), 'MMM dd, yyyy')}</span>
                </div>
              </div>

              <button
                onClick={() => handleViewChat(chat.id)}
                className="mt-6 w-full bg-orange-primary text-white py-2 px-4 rounded-md hover:bg-orange-secondary transition-colors duration-300 flex items-center justify-center"
              >
                View Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatList;