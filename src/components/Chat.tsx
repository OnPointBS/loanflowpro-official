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

  // Get real-time chat messages for this client
  const messages = useQuery(api.clientChats.getClientChatMessages, 
    !isDemo && workspaceId && clientId ? {
      workspaceId: workspaceId as any,
      clientId: clientId as any,
      limit: 100
    } : "skip"
  ) || [];

  // Get unread message count for this client
  const unreadCount = useQuery(api.clientChats.getUnreadCountForClient, 
    !isDemo && workspaceId && clientId ? {
      workspaceId: workspaceId as any,
      clientId: clientId as any
    } : "skip"
  ) || 0;

  // Mutations for client chat
  const sendAdvisorMessage = useMutation(api.clientChats.sendAdvisorMessage);
  const markAsReadByAdvisor = useMutation(api.clientChats.markAsReadByAdvisor);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read when chat is opened
  useEffect(() => {
    if (!isDemo && isOpen && unreadCount > 0 && workspaceId && clientId) {
      markAsReadByAdvisor({
        workspaceId: workspaceId as any,
        clientId: clientId as any,
      });
    }
  }, [isDemo, isOpen, unreadCount, workspaceId, clientId, markAsReadByAdvisor]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !user?._id) return;

    if (isDemo) {
      // In demo mode, just simulate sending a message
      console.log('Demo mode: Message would be sent:', message.trim());
      setMessage('');
      return;
    }

    setIsSending(true);
    try {
      await sendAdvisorMessage({
        workspaceId: workspaceId as any,
        clientId: clientId as any,
        advisorId: user._id as any,
        content: message.trim(),
      });
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
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
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-brand-orange/5 to-brand-orange/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center shadow-lg">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gunmetal text-lg">
                {isClientPortal ? `Chat with Advisor` : `Chat with ${clientName}`}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-gunmetal-light">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-brand-orange to-orange-500 rounded-full shadow-sm"></div>
                  <span className="font-medium">
                    {isClientPortal ? 'Advisor' : 'You'} • {user?.name || 'Advisor'}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-sm"></div>
                  <span className="font-medium">
                    {isClientPortal ? 'You' : 'Client'} • {isClientPortal ? 'Client' : clientName}
                  </span>
                </div>
              </div>
              <p className="text-xs text-gunmetal-light mt-1">
                {unreadCount > 0 ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-96 bg-gray-50/30">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-br from-brand-orange/20 to-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-brand-orange" />
              </div>
              <h4 className="text-lg font-semibold text-gunmetal mb-2">Start the Conversation</h4>
              <p className="text-gunmetal-light mb-1">No messages yet between you and {clientName}</p>
              <p className="text-sm text-gray-400">Send the first message to begin chatting!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.senderType === 'advisor';
              const senderName = isOwnMessage 
                ? (user?.name || 'Advisor') 
                : (isClientPortal ? 'Advisor' : clientName);
              const senderRole = isOwnMessage 
                ? (isClientPortal ? 'Client' : 'Advisor') 
                : (isClientPortal ? 'Advisor' : 'Client');
              
              return (
                <div
                  key={msg._id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'} max-w-xs lg:max-w-md`}>
                    {/* Sender Info - Only show for received messages */}
                    {!isOwnMessage && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                        <span className="text-xs font-medium text-gunmetal-light">
                          {senderName} • {senderRole}
                        </span>
                      </div>
                    )}
                    
                    {/* Message Bubble */}
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm max-w-[280px] ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-brand-orange to-orange-500 text-white rounded-br-md ml-auto shadow-lg'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-bl-md mr-auto shadow-lg'
                      }`}
                    >
                      <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                    </div>
                    
                    {/* Timestamp */}
                    <div className={`mt-2 px-1 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
                      <p className={`text-xs ${isOwnMessage ? 'text-orange-200' : 'text-blue-200'}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-gray-50/50">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={`Type your message to ${clientName}...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent bg-white shadow-sm"
                disabled={isSending}
              />
              {message.trim() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!message.trim() || isSending}
              className="px-6 py-3 bg-brand-orange text-white rounded-xl hover:bg-brand-orange-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center min-w-[60px]"
            >
              {isSending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            Messages are sent in real-time and stored securely
          </p>
        </form>
      </div>
    </div>
  );
};

export default Chat;
