import { webApiClient } from './client';
import { API_PATHS } from '../constants';
import type { WorkflowInfo, RunWorkflowRequest, WorkflowRunResult, PaginationResponse, ApiResponse, SnowflakeId } from '../types/api';

export const workflowApi = {
  list: (params?: { page?: number; page_size?: number }) =>
    webApiClient.get<ApiResponse<PaginationResponse<WorkflowInfo>>>(API_PATHS.WORKFLOWS, { params }).then(r => r.data),

  get: (id: SnowflakeId) =>
    webApiClient.get<ApiResponse<WorkflowInfo>>(API_PATHS.WORKFLOW_DETAIL(id)).then(r => r.data),

  create: (data: Partial<WorkflowInfo>) =>
    webApiClient.post<ApiResponse<WorkflowInfo>>(API_PATHS.WORKFLOWS, data).then(r => r.data),

  update: (id: SnowflakeId, data: Partial<WorkflowInfo>) =>
    webApiClient.put<ApiResponse<WorkflowInfo>>(API_PATHS.WORKFLOW_DETAIL(id), data).then(r => r.data),

  delete: (id: SnowflakeId) =>
    webApiClient.delete(API_PATHS.WORKFLOW_DETAIL(id)).then(r => r.data),

  run: (data: RunWorkflowRequest) =>
    webApiClient.post<ApiResponse<WorkflowRunResult>>(API_PATHS.WORKFLOW_RUN(data.workflow_id), data).then(r => r.data),

  runs: (id: SnowflakeId, params?: { page?: number; page_size?: number }) =>
    webApiClient.get<ApiResponse<PaginationResponse<WorkflowRunResult>>>(API_PATHS.WORKFLOW_RUNS(id), { params }).then(r => r.data),
};
