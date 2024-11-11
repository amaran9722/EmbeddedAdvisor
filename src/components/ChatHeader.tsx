import React from 'react';
import { X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <header>
      <div className="logo">AI Assistant</div>
      <button 
        className="close-button"
        onClick={onClose}
        aria-label="Close chat"
      >
        <X size={20} />
      </button>
    </header>
  );
}