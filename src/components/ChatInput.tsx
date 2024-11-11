import React from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function ChatInput({ value, onChange, onSubmit, isLoading }: ChatInputProps) {
  return (
    <form onSubmit={onSubmit} className="input-container">
      <input
        type="text"
        className="chat-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your message..."
        aria-label="Chat input"
      />
      <button 
        type="submit" 
        className="send-button"
        disabled={isLoading || !value.trim()}
        aria-label="Send message"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <Send size={20} />
        )}
      </button>
    </form>
  );
}