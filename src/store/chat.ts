import { create } from 'zustand';
import type { ChatMessage, SnowflakeId, RoleType, ToolCall } from '../types/api';

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingContent: string;
  streamingMessageId: string | null;
  toolCalls: ToolCall[];
  error: string | null;

  setMessages: (messages: ChatMessage[]) => void;
  appendMessage: (message: ChatMessage) => void;
  startStreaming: (messageId?: string) => void;
  appendDelta: (text: string) => void;
  appendToolCall: (name: string, args: string) => void;
  finishStreaming: (messageId: string, role?: RoleType) => void;
  clearStreaming: () => void;
  setError: (error: string | null) => void;
  clearMessages: () => void;
}

let tmpIdCounter = 0;
function genTmpId(): string {
  return `tmp_${Date.now()}_${++tmpIdCounter}`;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isStreaming: false,
  streamingContent: '',
  streamingMessageId: null,
  toolCalls: [],
  error: null,

  setMessages: (messages) => set({ messages }),

  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  startStreaming: (messageId) =>
    set({
      isStreaming: true,
      streamingContent: '',
      streamingMessageId: messageId || genTmpId(),
      toolCalls: [],
      error: null,
    }),

  appendDelta: (text) =>
    set((state) => ({
      streamingContent: state.streamingContent + text,
    })),

  appendToolCall: (name, args) =>
    set((state) => ({
      toolCalls: [...state.toolCalls, {
        id: `tc_${Date.now()}`,
        type: 'function' as const,
        function: { name, arguments: args },
      }],
    })),

  finishStreaming: (messageId, role = 'assistant') => {
    const { streamingContent, toolCalls } = get();
    const msg: ChatMessage = {
      id: messageId,
      conversation_id: '',
      role,
      type: 'text',
      content: streamingContent,
      content_type: 'markdown',
      tool_calls: toolCalls.length > 0 ? toolCalls : undefined,
      created_at: String(Date.now()),
      updated_at: String(Date.now()),
    };
    set((state) => ({
      messages: [...state.messages, msg],
      isStreaming: false,
      streamingContent: '',
      streamingMessageId: null,
      toolCalls: [],
    }));
  },

  clearStreaming: () =>
    set({ isStreaming: false, streamingContent: '', streamingMessageId: null, toolCalls: [] }),

  setError: (error) => set({ error, isStreaming: false }),

  clearMessages: () =>
    set({ messages: [], streamingContent: '', toolCalls: [], error: null }),
}));
