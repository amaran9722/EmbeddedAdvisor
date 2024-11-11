import React, { useState, useRef, useEffect } from 'react';
import { X, MessageSquare, Send, Loader2 } from 'lucide-react';
import { ChatMessage, ChatHistoryEntry, ChatRequest } from '../types/chat';
import { sendChatMessage } from '../services/chatService';
import Message from './Message';
import './ChatWidget.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const sessionId = useRef(`session_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const threadId = useRef(`thread_${Date.now()}_${Math.random().toString(36).slice(2)}`);
  const userId = useRef(`user_${Math.random().toString(36).slice(2)}`);

  const quickPrompts = [
    "Tell me about your services",
    "How can you help me?",
    "What are your features?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatChatHistory = (messages: ChatMessage[]): ChatHistoryEntry[] => {
    return messages.map(msg => ({
      AuthorRole: msg.type === 'user' ? 'User' : 'Assistant',
      Content: msg.content,
      IsCriticalContext: (msg.isCriticalContext ?? false).toString(),
      Timestamp: msg.timestamp.toISOString()
    }));
  };

  const createChatRequest = (query: string): ChatRequest => {
    return {
      SessionId: sessionId.current,
      ChatThreadId: threadId.current,
      UserId: userId.current,
      Query: query,
      ChatHistory: formatChatHistory(messages)
    };
  };

  const handleMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
      isCriticalContext: false
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatRequest = createChatRequest(content);
      const data = await sendChatMessage(chatRequest);
      
      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: data.Summary,
        timestamp: new Date(),
        isCriticalContext: true,
        docs: data.Docs,
        highlights: data.Highlights,
        citations: data.Citations,
        followups: data.Followups
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = 'I apologize, but I encountered an error. Please try again.';
      const errorResponseMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: errorMessage,
        timestamp: new Date(),
        isCriticalContext: false
      };
      setMessages(prev => [...prev, errorResponseMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleMessage(inputValue);
  };

  const WelcomeMessage = () => (
    <div className="welcome-message">
      <p>👋 Hello! How can I assist you today?</p>
      <div className="prompts-container">
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            className="prompt-button"
            onClick={() => handleMessage(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`chat-widget-container ${isOpen ? '' : 'collapsed'}`}>
      {isOpen && (
        <div className="app-container">
          <header>
            <div className="logo">AI Assistant</div>
            <button 
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </header>

          <div className="chat-messages" role="log">
            {messages.length === 0 && <WelcomeMessage />}
            
            {messages.map((message) => (
              <Message
                key={message.id}
                content={message.content}
                timestamp={message.timestamp}
                type={message.type}
              />
            ))}
            
            {isLoading && (
              <Message
                content=""
                timestamp={new Date()}
                type="bot"
                isLoading={true}
              />
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="input-container">
            <input
              type="text"
              className="chat-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              aria-label="Chat input"
            />
            <button 
              type="submit" 
              className="send-button"
              disabled={isLoading || !inputValue.trim()}
              aria-label="Send message"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Send size={20} />
              )}
            </button>
          </form>
        </div>
      )}

      <button 
        className={`chat-toggle-button ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Minimize chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
    </div>
  );
}