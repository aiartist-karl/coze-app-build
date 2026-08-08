import { webApiClient } from './client';
import { API_PATHS } from '../constants';
import type { DatabaseInfo, DatabaseRow, VariableMemory, PaginationResponse, ApiResponse, SnowflakeId } from '../types/api';

export const memoryApi = {
  // 结构化数据库
  databases: () =>
    webApiClient.get<ApiResponse<DatabaseInfo[]>>(API_PATHS.DATABASES).then(r => r.data),

  createDatabase: (data: { name: string; description?: string; fields: any[] }) =>
    webApiClient.post<ApiResponse<DatabaseInfo>>(API_PATHS.DATABASES, data).then(r => r.data),

  rows: (databaseId: SnowflakeId, params?: { page?: number; page_size?: number }) =>
    webApiClient.get<ApiResponse<PaginationResponse<DatabaseRow>>>(API_PATHS.DATABASE_ROWS(databaseId), { params }).then(r => r.data),

  addRow: (databaseId: SnowflakeId, data: Record<string, any>) =>
    webApiClient.post<ApiResponse<DatabaseRow>>(API_PATHS.DATABASE_ROWS(databaseId), { data }).then(r => r.data),

  updateRow: (databaseId: SnowflakeId, rowId: SnowflakeId, data: Record<string, any>) =>
    webApiClient.put<ApiResponse<DatabaseRow>>(`${API_PATHS.DATABASE_ROWS(databaseId)}/${rowId}`, { data }).then(r => r.data),

  deleteRow: (databaseId: SnowflakeId, rowId: SnowflakeId) =>
    webApiClient.delete(`${API_PATHS.DATABASE_ROWS(databaseId)}/${rowId}`).then(r => r.data),

  query: (databaseId: SnowflakeId, filter?: any[], orderBy?: any[]) =>
    webApiClient.post<ApiResponse<DatabaseRow[]>>(API_PATHS.DATABASE_QUERY(databaseId), { filter, order_by: orderBy }).then(r => r.data),

  // 变量记忆
  variables: (botId?: SnowflakeId) =>
    webApiClient.get<ApiResponse<VariableMemory[]>>(API_PATHS.VARIABLES, { params: { bot_id: botId } }).then(r => r.data),

  setVariable: (data: { key: string; value: any; value_type: string; bot_id?: SnowflakeId; description?: string }) =>
    webApiClient.post<ApiResponse<VariableMemory>>(API_PATHS.VARIABLES, data).then(r => r.data),

  deleteVariable: (id: SnowflakeId) =>
    webApiClient.delete(`${API_PATHS.VARIABLES}/${id}`).then(r => r.data),
};
