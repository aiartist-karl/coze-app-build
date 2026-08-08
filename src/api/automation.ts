import { webApiClient } from './client';
import { API_PATHS } from '../constants';
import type { AutomationFlow, AutomationRunLog, PaginationResponse, ApiResponse, SnowflakeId } from '../types/api';

export const automationApi = {
  list: (params?: { page?: number; page_size?: number }) =>
    webApiClient.get<ApiResponse<PaginationResponse<AutomationFlow>>>(API_PATHS.AUTOMATIONS, { params }).then(r => r.data),

  get: (id: SnowflakeId) =>
    webApiClient.get<ApiResponse<AutomationFlow>>(API_PATHS.AUTOMATION_DETAIL(id)).then(r => r.data),

  create: (data: Partial<AutomationFlow>) =>
    webApiClient.post<ApiResponse<AutomationFlow>>(API_PATHS.AUTOMATIONS, data).then(r => r.data),

  update: (id: SnowflakeId, data: Partial<AutomationFlow>) =>
    webApiClient.put<ApiResponse<AutomationFlow>>(API_PATHS.AUTOMATION_DETAIL(id), data).then(r => r.data),

  delete: (id: SnowflakeId) =>
    webApiClient.delete(API_PATHS.AUTOMATION_DETAIL(id)).then(r => r.data),

  toggle: (id: SnowflakeId, enabled: boolean) =>
    webApiClient.patch<ApiResponse<AutomationFlow>>(API_PATHS.AUTOMATION_DETAIL(id), { enabled }).then(r => r.data),

  trigger: (id: SnowflakeId) =>
    webApiClient.post<ApiResponse<{ run_id: SnowflakeId }>>(API_PATHS.AUTOMATION_TRIGGER(id)).then(r => r.data),

  runs: (id: SnowflakeId, params?: { page?: number; page_size?: number }) =>
    webApiClient.get<ApiResponse<PaginationResponse<AutomationRunLog>>>(API_PATHS.AUTOMATION_RUNS(id), { params }).then(r => r.data),
};
