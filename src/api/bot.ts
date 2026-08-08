import { webApiClient } from './client';
import { API_PATHS, OPENAPI_CONNECTOR_ID } from '../constants';
import type { BotInfo, CreateBotRequest, PublishBotRequest, PaginationResponse, ApiResponse, SnowflakeId } from '../types/api';

export const botApi = {
  list: (params?: { page?: number; page_size?: number; workspace_id?: string }) =>
    webApiClient.get<ApiResponse<PaginationResponse<BotInfo>>>(API_PATHS.BOTS, { params }).then(r => r.data),

  get: (id: SnowflakeId) =>
    webApiClient.get<ApiResponse<BotInfo>>(API_PATHS.BOT_DETAIL(id)).then(r => r.data),

  create: (data: CreateBotRequest) => {
    // 自动补充 connector_ids 含 1024
    const connectorIds = data.connector_ids || [];
    if (!connectorIds.includes(OPENAPI_CONNECTOR_ID)) {
      connectorIds.push(OPENAPI_CONNECTOR_ID);
    }
    return webApiClient.post<ApiResponse<BotInfo>>(API_PATHS.BOTS, { ...data, connector_ids: connectorIds }).then(r => r.data);
  },

  update: (id: SnowflakeId, data: Partial<CreateBotRequest>) =>
    webApiClient.put<ApiResponse<BotInfo>>(API_PATHS.BOT_DETAIL(id), data).then(r => r.data),

  delete: (id: SnowflakeId) =>
    webApiClient.delete(API_PATHS.BOT_DETAIL(id)).then(r => r.data),

  publish: (data: PublishBotRequest) => {
    // 强制校验 connector_ids 含 1024
    if (!data.connector_ids.includes(OPENAPI_CONNECTOR_ID)) {
      data.connector_ids.push(OPENAPI_CONNECTOR_ID);
    }
    return webApiClient.post<ApiResponse<{ bot_id: SnowflakeId; version: string }>>(API_PATHS.BOT_PUBLISH, data).then(r => r.data);
  },

  /** 检查 Bot 是否支持 OpenAPI 调用 */
  isOpenApiEnabled: (bot: BotInfo): boolean =>
    bot.connector_ids.includes(OPENAPI_CONNECTOR_ID),
};
