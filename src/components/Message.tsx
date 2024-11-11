import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface MessageProps {
  content: string;
  timestamp: Date;
  type: 'user' | 'bot';
  isLoading?: boolean;
}

export default function Message({ content, timestamp, type, isLoading }: MessageProps) {
  const [feedback, setFeedback] = useState<'positive' | 'negative' | null>(null);

  const handleFeedback = async (isPositive: boolean) => {
    const newFeedback = isPositive ? 'positive' : 'negative';
    if (feedback === newFeedback) return;
    
    setFeedback(newFeedback);
    
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'feedback',
          feedback: newFeedback,
          content
        }),
      });
    } catch (error) {
      console.error('Failed to send feedback:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="message bot-message loading">
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`message ${type}-message`} 
      role="listitem"
    >
      <div className="message-content">{content}</div>
      {type === 'bot' && (
        <div className="message-feedback">
          <button
            className={`feedback-button ${feedback === 'positive' ? 'active' : ''}`}
            onClick={() => handleFeedback(true)}
            aria-label="Positive feedback"
          >
            <ThumbsUp size={16} />
          </button>
          <button
            className={`feedback-button ${feedback === 'negative' ? 'active' : ''}`}
            onClick={() => handleFeedback(false)}
            aria-label="Negative feedback"
          >
            <ThumbsDown size={16} />
          </button>
        </div>
      )}
      <div className="message-timestamp">
        {new Date(timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        })}
      </div>
    </div>
  );
}