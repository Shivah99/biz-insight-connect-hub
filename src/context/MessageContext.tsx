
import React, { createContext, useContext, useState } from 'react';
import { Message } from '../types';
import { useAuth } from './AuthContext';

interface MessageContextType {
  messages: Message[];
  sendMessage: (receiverId: string, content: string) => Promise<Message>;
  getConversation: (userId: string) => Message[];
  markAsRead: (messageId: string) => Promise<void>;
  unreadCount: number;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Mock data for our demo
const MOCK_MESSAGES: Message[] = [
  {
    id: "1",
    senderId: "1", // General user
    receiverId: "2", // Business user
    content: "I'm interested in your software solutions. Can we schedule a demo?",
    createdAt: new Date("2023-04-05T10:30:00"),
    isRead: true
  },
  {
    id: "2",
    senderId: "2", // Business user
    receiverId: "1", // General user
    content: "Absolutely! We'd be happy to show you our software suite. How about next Tuesday at 2 PM?",
    createdAt: new Date("2023-04-05T11:45:00"),
    isRead: false
  }
];

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const { user } = useAuth();

  const sendMessage = async (receiverId: string, content: string): Promise<Message> => {
    if (!user) {
      throw new Error("You must be logged in to send messages");
    }
    
    // In a real app, this would be an API call
    const newMessage: Message = {
      id: Math.random().toString(36).substring(2, 11),
      senderId: user.id,
      receiverId,
      content,
      createdAt: new Date(),
      isRead: false
    };
    
    setMessages([...messages, newMessage]);
    return newMessage;
  };

  const getConversation = (userId: string): Message[] => {
    if (!user) return [];
    
    return messages.filter(msg => 
      (msg.senderId === user.id && msg.receiverId === userId) || 
      (msg.receiverId === user.id && msg.senderId === userId)
    ).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };

  const markAsRead = async (messageId: string): Promise<void> => {
    // In a real app, this would be an API call
    const index = messages.findIndex(m => m.id === messageId);
    if (index !== -1) {
      const updatedMessages = [...messages];
      updatedMessages[index] = { ...messages[index], isRead: true };
      setMessages(updatedMessages);
    }
  };

  // Calculate unread messages count for current user
  const unreadCount = user
    ? messages.filter(m => m.receiverId === user.id && !m.isRead).length
    : 0;

  return (
    <MessageContext.Provider 
      value={{ 
        messages, 
        sendMessage, 
        getConversation, 
        markAsRead,
        unreadCount
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
};
