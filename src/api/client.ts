import axios, { AxiosInstance, AxiosError } from 'axios';
import Constants from 'expo-constants';

const WEB_API_BASE = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE || 'http://localhost:8080';
const OPEN_API_BASE = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPEN_API_BASE || 'http://localhost:9091';
const ENABLE_LOG = Constants.expoConfig?.extra?.EXPO_PUBLIC_ENABLE_API_LOG === 'true';

type AuthMode = 'none' | 'session' | 'bearer' | 'apikey';

interface ClientOptions {
  baseURL: string;
  authMode: AuthMode;
  sessionId?: string;
  bearerToken?: string;
  apiKey?: string;
}

function createClient(options: ClientOptions): AxiosInstance {
  const { baseURL, authMode, sessionId, bearerToken, apiKey } = options;

  const client = axios.create({
    baseURL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' },
  });

  // 请求拦截器：注入认证头
  client.interceptors.request.use((config) => {
    switch (authMode) {
      case 'session':
        if (sessionId) {
          config.headers['X-Session-Id'] = sessionId;
          config.headers['Cookie'] = `session_id=${sessionId}`;
        }
        break;
      case 'bearer':
        if (bearerToken) {
          config.headers['Authorization'] = `Bearer ${bearerToken}`;
        }
        break;
      case 'apikey':
        if (apiKey) {
          config.headers['X-API-Key'] = apiKey;
        }
        break;
    }
    if (ENABLE_LOG) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  });

  // 响应拦截器：统一解包 + 错误处理
  client.interceptors.response.use(
    (response) => {
      const body = response.data;
      // 如果响应是 { code, msg, data } 格式，解包 data
      if (body && typeof body === 'object' && 'code' in body && 'data' in body) {
        if (body.code !== 0 && body.code !== 200) {
          return Promise.reject(new Error(body.msg || '请求失败'));
        }
        return { ...response, data: body.data };
      }
      return response;
    },
    (error: AxiosError) => {
      if (ENABLE_LOG) {
        console.error(`[API Error] ${error.response?.status} ${error.config?.url}`, error.message);
      }
      if (error.response?.status === 401) {
        // 401 未授权，抛出特殊错误让上层处理踢下线
        const authError = new Error('UNAUTHORIZED') as any;
        authError.code = 401;
        return Promise.reject(authError);
      }
      return Promise.reject(error);
    }
  );

  return client;
}

// 4 种客户端实例
let _sessionId: string | undefined;
let _bearerToken: string | undefined;

export function setSessionId(id: string) { _sessionId = id; }
export function setBearerToken(token: string) { _bearerToken = token; }
export function clearAuth() { _sessionId = undefined; _bearerToken = undefined; }

export const webApiClient = createClient({
  baseURL: WEB_API_BASE,
  authMode: 'session',
  get sessionId() { return _sessionId; },
});

export const openApiClient = createClient({
  baseURL: OPEN_API_BASE,
  authMode: 'bearer',
  get bearerToken() { return _bearerToken; },
});

export const noAuthClient = createClient({
  baseURL: WEB_API_BASE,
  authMode: 'none',
});

export function createApiKeyClient(apiKey: string): AxiosInstance {
  return createClient({
    baseURL: WEB_API_BASE,
    authMode: 'apikey',
    apiKey,
  });
}

// 雪花 ID 安全处理：递归把 number 类型的大整数转 string
export function normalizeIds(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'number') {
    // 超过 JS 安全整数范围的数字转 string
    if (Math.abs(obj) > Number.MAX_SAFE_INTEGER) return String(obj);
    return obj;
  }
  if (typeof obj === 'string') return obj;
  if (Array.isArray(obj)) return obj.map(normalizeIds);
  if (typeof obj === 'object') {
    const result: any = {};
    for (const key of Object.keys(obj)) {
      // 常见 ID 字段名
      if (key.endsWith('_id') || key === 'id' || key.endsWith('_ids')) {
        result[key] = typeof obj[key] === 'number' ? String(obj[key]) : obj[key];
      } else {
        result[key] = normalizeIds(obj[key]);
      }
    }
    return result;
  }
  return obj;
}
