import axios from 'axios';
import { ChatRequest, ResponseDTO } from '../types/chat';

const API_URL = 'http://localhost:7214/api/chat';

export async function sendChatMessage(chatRequest: ChatRequest): Promise<ResponseDTO> {
  try {
    const response = await axios.post<ResponseDTO>(
      API_URL,
      chatRequest,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 30000
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
}