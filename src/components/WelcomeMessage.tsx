import React from 'react';

interface WelcomeMessageProps {
  quickPrompts: string[];
  onPromptClick: (prompt: string) => void;
}

export default function WelcomeMessage({ quickPrompts, onPromptClick }: WelcomeMessageProps) {
  return (
    <div className="welcome-message">
      <p>👋 Hello! How can I assist you today?</p>
      <div className="prompts-container">
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            className="prompt-button"
            onClick={() => onPromptClick(prompt)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}