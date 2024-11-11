export interface Doc {
  Title: string;
  FunctionalOwner: string;
  ModifiedDate: string;
  Link: string;
}

export interface ResponseDTO {
  SessionId: string;
  UserId: string;
  Summary: string;
  Docs: Doc[];
  Highlights: string[];
  Citations: string[];
  Followups: string[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: Date;
  isCriticalContext?: boolean;
  docs?: Doc[];
  highlights?: string[];
  citations?: string[];
  followups?: string[];
}

export interface ChatHistoryEntry {
  AuthorRole: 'User' | 'Assistant';
  Content: string;
  IsCriticalContext: string;
  Timestamp: string;
}

export interface ChatRequest {
  SessionId: string;
  ChatThreadId: string;
  UserId: string;
  Query: string;
  ChatHistory: ChatHistoryEntry[];
}