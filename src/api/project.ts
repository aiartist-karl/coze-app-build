import { webApiClient } from './client';
import { API_PATHS } from '../constants';
import type { ProjectInfo, CreateProjectRequest, PaginationResponse, ApiResponse, SnowflakeId, UserInfo } from '../types/api';

export const projectApi = {
  list: (params?: { page?: number; page_size?: number; project_type?: string }) =>
    webApiClient.get<ApiResponse<PaginationResponse<ProjectInfo>>>(API_PATHS.PROJECTS, { params }).then(r => r.data),

  get: (id: SnowflakeId) =>
    webApiClient.get<ApiResponse<ProjectInfo>>(API_PATHS.PROJECT_DETAIL(id)).then(r => r.data),

  create: (data: CreateProjectRequest) =>
    webApiClient.post<ApiResponse<ProjectInfo>>(API_PATHS.PROJECTS, data).then(r => r.data),

  update: (id: SnowflakeId, data: Partial<CreateProjectRequest>) =>
    webApiClient.put<ApiResponse<ProjectInfo>>(API_PATHS.PROJECT_DETAIL(id), data).then(r => r.data),

  delete: (id: SnowflakeId) =>
    webApiClient.delete(API_PATHS.PROJECT_DETAIL(id)).then(r => r.data),

  members: (id: SnowflakeId) =>
    webApiClient.get<ApiResponse<UserInfo[]>>(API_PATHS.PROJECT_MEMBERS(id)).then(r => r.data),

  addMember: (projectId: SnowflakeId, userId: SnowflakeId) =>
    webApiClient.post<ApiResponse<{ success: boolean }>>(API_PATHS.PROJECT_MEMBERS(projectId), { user_id: userId }).then(r => r.data),

  removeMember: (projectId: SnowflakeId, userId: SnowflakeId) =>
    webApiClient.delete(`${API_PATHS.PROJECT_MEMBERS(projectId)}/${userId}`).then(r => r.data),
};
