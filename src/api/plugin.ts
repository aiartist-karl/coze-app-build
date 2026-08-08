import { webApiClient } from './client';
import { API_PATHS } from '../constants';
import type { PluginInfo, PaginationResponse, ApiResponse, SnowflakeId } from '../types/api';

export const pluginApi = {
  list: (params?: { page?: number; page_size?: number; type?: string }) =>
    webApiClient.get<ApiResponse<PaginationResponse<PluginInfo>>>(API_PATHS.PLUGINS, { params }).then(r => r.data),

  get: (id: SnowflakeId) =>
    webApiClient.get<ApiResponse<PluginInfo>>(API_PATHS.PLUGIN_DETAIL(id)).then(r => r.data),

  create: (data: { name: string; description?: string; openapi_spec: string }) =>
    webApiClient.post<ApiResponse<PluginInfo>>(API_PATHS.PLUGINS, data).then(r => r.data),

  update: (id: SnowflakeId, data: Partial<{ name: string; description: string; openapi_spec: string }>) =>
    webApiClient.put<ApiResponse<PluginInfo>>(API_PATHS.PLUGIN_DETAIL(id), data).then(r => r.data),

  delete: (id: SnowflakeId) =>
    webApiClient.delete(API_PATHS.PLUGIN_DETAIL(id)).then(r => r.data),

  invoke: (id: SnowflakeId, toolName: string, args: Record<string, any>) =>
    webApiClient.post<ApiResponse<any>>(API_PATHS.PLUGIN_INVOKE(id), { tool_name: toolName, arguments: args }).then(r => r.data),

  oauthUrl: (id: SnowflakeId) =>
    webApiClient.get<ApiResponse<{ url: string }>>(`${API_PATHS.PLUGIN_DETAIL(id)}/oauth_url`).then(r => r.data),
};
