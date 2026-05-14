export interface ChatMessage {
    id?: string;
    senderId: number;
    senderName: string;
    content: string;
    timestamp?: string;
  }