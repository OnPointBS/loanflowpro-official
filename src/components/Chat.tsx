import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../auth/AuthProvider';
import { MessageSquare, Send, X, User, Bot } from 'lucide-react';

interface ChatProps {
  workspaceId: string;
  clientId: string;
  clientName: string;
  isOpen: boolean;
  onClose: () => void;
  isClientPortal?: boolean; // To determine if this is from client portal
  isDemo?: boolean; // To determine if this is demo mode
}

const Chat: React.FC<ChatProps> = ({ workspaceId, clientId, clientName, isOpen, onClose, isClientPortal = false, isDemo = false }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // For client chats, we need to handle this differently since clientId is not a user ID
  // We'll create a simple client chat mode that doesn't rely on the user-to-user messaging system
  const [localMessages, setLocalMessages] = useState<Array<{
    id: string;
    content: string;
    timestamp: number;
    sender: 'advisor' | 'client';
  }>>([]);

  // In client chat mode, we don't use the existing messaging system
  // Instead, we'll create a simple local chat experience
  const messages = localMessages;
  const unreadCount = 0; // No unread count for client chats

  // For client chats, we don't need these mutations
  // const sendMessage = useMutation(api.messages.sendMessage);
  // const markAsRead = useMutation(api.messages.markAllMessagesAsRead);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // For client chats, we don't need to mark messages as read
  // since we're using a local messaging system
  useEffect(() => {
    // This effect is not needed for client chats
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isDemo) {
      // In demo mode, just simulate sending a message
      console.log('Demo mode: Message would be sent:', message.trim());
      setMessage('');
      return;
    }

    // For client chats, we'll add messages locally
    const newMessage = {
      id: Date.now().toString(),
      content: message.trim(),
      timestamp: Date.now(),
      sender: 'advisor' as const,
    };

    setLocalMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate client response after a short delay
    setTimeout(() => {
      const clientResponse = {
        id: (Date.now() + 1).toString(),
        content: `Thanks for your message! This is a simulated response from ${clientName}.`,
        timestamp: Date.now(),
        sender: 'client' as const,
      };
      setLocalMessages(prev => [...prev, clientResponse]);
    }, 1000);
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-brand-orange rounded-full flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gunmetal">
                {isClientPortal ? `Chat with Advisor` : `Chat with ${clientName}`}
              </h3>
              <p className="text-sm text-gunmetal-light">
                {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96">
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.senderId === user?._id;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? 'bg-brand-orange text-white rounded-br-md'
                        : 'bg-gray-100 text-gunmetal rounded-bl-md'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {isOwnMessage ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                      <span className="text-xs opacity-75">
                        {isOwnMessage ? 'You' : (isClientPortal ? 'Advisor' : clientName)}
                      </span>
                    </div>
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${isOwnMessage ? 'text-orange-100' : 'text-gray-500'}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="px-4 py-2 bg-brand-orange text-white rounded-lg hover:bg-brand-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Chat;
