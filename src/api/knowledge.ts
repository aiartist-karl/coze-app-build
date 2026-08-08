import { webApiClient } from './client';
import { API_PATHS } from '../constants';
import type { KnowledgeInfo, KnowledgeDocument, SearchKnowledgeRequest, SearchKnowledgeResult, PaginationResponse, ApiResponse, SnowflakeId } from '../types/api';

export const knowledgeApi = {
  list: (params?: { page?: number; page_size?: number }) =>
    webApiClient.get<ApiResponse<PaginationResponse<KnowledgeInfo>>>(API_PATHS.KNOWLEDGE, { params }).then(r => r.data),

  get: (id: SnowflakeId) =>
    webApiClient.get<ApiResponse<KnowledgeInfo>>(API_PATHS.KNOWLEDGE_DETAIL(id)).then(r => r.data),

  create: (data: { name: string; description?: string }) =>
    webApiClient.post<ApiResponse<KnowledgeInfo>>(API_PATHS.KNOWLEDGE, data).then(r => r.data),

  delete: (id: SnowflakeId) =>
    webApiClient.delete(API_PATHS.KNOWLEDGE_DETAIL(id)).then(r => r.data),

  documents: (knowledgeId: SnowflakeId) =>
    webApiClient.get<ApiResponse<KnowledgeDocument[]>>(API_PATHS.KNOWLEDGE_DOCUMENTS(knowledgeId)).then(r => r.data),

  uploadDocument: (knowledgeId: SnowflakeId, formData: FormData) =>
    webApiClient.post<ApiResponse<KnowledgeDocument>>(
      API_PATHS.KNOWLEDGE_DOCUMENTS(knowledgeId), formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    ).then(r => r.data),

  deleteDocument: (knowledgeId: SnowflakeId, documentId: SnowflakeId) =>
    webApiClient.delete(`${API_PATHS.KNOWLEDGE_DOCUMENTS(knowledgeId)}/${documentId}`).then(r => r.data),

  search: (data: SearchKnowledgeRequest) =>
    webApiClient.post<ApiResponse<SearchKnowledgeResult[]>>(API_PATHS.KNOWLEDGE_SEARCH, data).then(r => r.data),
};
