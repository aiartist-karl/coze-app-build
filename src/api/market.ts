import { webApiClient } from './client';
import { API_PATHS } from '../constants';
import type { MarketAgentItem, MarketCategory, PaginationResponse, ApiResponse, SnowflakeId } from '../types/api';

export const marketApi = {
  categories: () =>
    webApiClient.get<ApiResponse<MarketCategory[]>>(API_PATHS.MARKET_CATEGORIES).then(r => r.data),

  agents: (params?: { page?: number; page_size?: number; category?: string; keyword?: string }) =>
    webApiClient.get<ApiResponse<PaginationResponse<MarketAgentItem>>>(API_PATHS.MARKET_AGENTS, { params }).then(r => r.data),

  agentDetail: (id: SnowflakeId) =>
    webApiClient.get<ApiResponse<MarketAgentItem>>(API_PATHS.MARKET_AGENT_DETAIL(id)).then(r => r.data),

  install: (agentId: SnowflakeId) =>
    webApiClient.post<ApiResponse<{ success: boolean }>>(API_PATHS.MARKET_INSTALL, { agent_id: agentId }).then(r => r.data),

  rate: (agentId: SnowflakeId, score: number) =>
    webApiClient.post<ApiResponse<{ success: boolean }>>('/api/market/rate', { agent_id: agentId, score }).then(r => r.data),

  recommended: (params?: { limit?: number }) =>
    webApiClient.get<ApiResponse<MarketAgentItem[]>>('/api/market/recommended', { params }).then(r => r.data),
};
