import { webApiClient, openApiClient } from './client';
import { API_PATHS } from '../constants';
import type {
  ConversationInfo, ChatMessage, CreateConversationRequest,
  SendMessageRequest, PaginationResponse, ApiResponse, SnowflakeId,
} from '../types/api';

export const chatApi = {
  // 会话
  listConversations: (params?: { page?: number; page_size?: number }) =>
    webApiClient.get<ApiResponse<PaginationResponse<ConversationInfo>>>(API_PATHS.CONVERSATIONS, { params }).then(r => r.data),

  createConversation: (data: CreateConversationRequest) =>
    webApiClient.post<ApiResponse<ConversationInfo>>(API_PATHS.CONVERSATIONS, data).then(r => r.data),

  getConversation: (id: SnowflakeId) =>
    webApiClient.get<ApiResponse<ConversationInfo>>(API_PATHS.CONVERSATION_DETAIL(id)).then(r => r.data),

  deleteConversation: (id: SnowflakeId) =>
    webApiClient.delete(API_PATHS.CONVERSATION_DETAIL(id)).then(r => r.data),

  // 消息
  getMessages: (conversationId: SnowflakeId, params?: { page?: number; page_size?: number }) =>
    webApiClient.get<ApiResponse<PaginationResponse<ChatMessage>>>(
      API_PATHS.CONVERSATION_MESSAGES(conversationId), { params }
    ).then(r => r.data),

  sendMessage: (data: SendMessageRequest) =>
    webApiClient.post<ApiResponse<ChatMessage>>(
      API_PATHS.CONVERSATION_MESSAGES(data.conversation_id || ''), data
    ).then(r => r.data),

  // 文件上传
  uploadFile: (formData: FormData) =>
    webApiClient.post<ApiResponse<{ file_id: SnowflakeId; file_url: string }>>(
      API_PATHS.UPLOAD, formData, { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then(r => r.data),
};
