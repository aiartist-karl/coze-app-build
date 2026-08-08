/**
 * SSE 流式聊天
 * 支持 WebAPI (Session) 和 OpenAPI (Bearer) 两种协议
 */
import Constants from 'expo-constants';

const WEB_API_BASE = Constants.expoConfig?.extra?.EXPO_PUBLIC_API_BASE || 'http://localhost:8080';
const OPEN_API_BASE = Constants.expoConfig?.extra?.EXPO_PUBLIC_OPEN_API_BASE || 'http://localhost:9091';

export interface SseCallbacks {
  onDelta: (text: string) => void;
  onToolCall?: (name: string, args: string) => void;
  onComplete: (messageId: string, usage?: any) => void;
  onError: (error: Error) => void;
  onStatus?: (status: string) => void;
}

interface StreamOptions {
  sessionId?: string;
  bearerToken?: string;
  useOpenApi: boolean;
}

export function sendMessageStream(
  body: Record<string, any>,
  callbacks: SseCallbacks,
  options: StreamOptions
): { abort: () => void } {
  const baseURL = options.useOpenApi ? OPEN_API_BASE : WEB_API_BASE;
  const url = options.useOpenApi
    ? `${baseURL}/v3/chat`
    : `${baseURL}/api/conversations/stream`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'text/event-stream',
  };

  if (options.sessionId) {
    headers['X-Session-Id'] = options.sessionId;
  }
  if (options.bearerToken) {
    headers['Authorization'] = `Bearer ${options.bearerToken}`;
  }

  let aborted = false;
  const controller = new AbortController();

  (async () => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...body, stream: true }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let buffer = '';

      callbacks.onStatus?.('streaming');

      while (true) {
        if (aborted) break;
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (aborted) break;
          if (line.startsWith('event:')) {
            const eventType = line.slice(6).trim();
            // 读取下一行 data
            continue;
          }
          if (line.startsWith('data:')) {
            const dataStr = line.slice(5).trim();
            if (!dataStr || dataStr === '[DONE]') {
              callbacks.onComplete('', undefined);
              continue;
            }
            try {
              const data = JSON.parse(dataStr);
              handleSseEvent(data, callbacks);
            } catch {
              // 非 JSON 数据直接当文本
              if (dataStr) callbacks.onDelta(dataStr);
            }
          }
        }
      }

      callbacks.onStatus?.('complete');
    } catch (error: any) {
      if (error.name === 'AbortError') return;
      callbacks.onError(error);
    }
  })();

  return {
    abort: () => {
      aborted = true;
      controller.abort();
    },
  };
}

function handleSseEvent(data: any, callbacks: SseCallbacks) {
  // OpenAPI 格式
  if (data.type === 'answer' && data.content) {
    callbacks.onDelta(data.content);
    return;
  }
  if (data.type === 'verbose' && data.content) {
    callbacks.onDelta(data.content);
    return;
  }
  if (data.type === 'tool_call' && data.name) {
    callbacks.onToolCall?.(data.name, data.input || JSON.stringify(data));
    return;
  }
  if (data.type === 'done' || data.event === 'done') {
    callbacks.onComplete(data.message_id || data.chat_id || '', data.usage);
    return;
  }
  if (data.event === 'error') {
    callbacks.onError(new Error(data.error?.message || '流式请求失败'));
    return;
  }

  // WebAPI 格式
  if (data.content) {
    callbacks.onDelta(data.content);
  }
  if (data.tool_calls) {
    for (const tc of data.tool_calls) {
      callbacks.onToolCall?.(tc.function?.name || 'unknown', tc.function?.arguments || '{}');
    }
  }
  if (data.is_final) {
    callbacks.onComplete(data.message_id || '', data.usage);
  }
}

/**
 * 检查 Bot 是否支持 OpenAPI（connector_ids 包含 1024）
 */
export function isBotOpenApiEnabled(connectorIds: string[]): boolean {
  return connectorIds.includes('1024');
}
