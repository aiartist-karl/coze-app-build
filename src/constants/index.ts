export { Colors, Spacing, BorderRadius, FontSize, Shadows } from './theme';

export const OPENAPI_CONNECTOR_ID = '1024';

export const API_PATHS = {
  // 认证
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  SEND_CODE: '/api/auth/send_code',
  RESET_PASSWORD: '/api/auth/reset_password',
  LOGOUT: '/api/auth/logout',
  ME: '/api/auth/me',

  // Bot
  BOTS: '/api/bots',
  BOT_DETAIL: (id: string) => `/api/bots/${id}`,
  BOT_PUBLISH: '/api/bots/publish',

  // 聊天
  CONVERSATIONS: '/api/conversations',
  CONVERSATION_DETAIL: (id: string) => `/api/conversations/${id}`,
  CONVERSATION_MESSAGES: (id: string) => `/api/conversations/${id}/messages`,
  CONVERSATION_STREAM: (id: string) => `/api/conversations/${id}/stream`,

  // 知识库
  KNOWLEDGE: '/api/knowledge',
  KNOWLEDGE_DETAIL: (id: string) => `/api/knowledge/${id}`,
  KNOWLEDGE_DOCUMENTS: (id: string) => `/api/knowledge/${id}/documents`,
  KNOWLEDGE_SEARCH: '/api/knowledge/search',

  // 工作流
  WORKFLOWS: '/api/workflows',
  WORKFLOW_DETAIL: (id: string) => `/api/workflows/${id}`,
  WORKFLOW_RUN: (id: string) => `/api/workflows/${id}/run`,
  WORKFLOW_RUNS: (id: string) => `/api/workflows/${id}/runs`,

  // 数据库 Memory
  DATABASES: '/api/databases',
  DATABASE_ROWS: (id: string) => `/api/databases/${id}/rows`,
  DATABASE_QUERY: (id: string) => `/api/databases/${id}/query`,
  VARIABLES: '/api/variables',

  // 市场
  MARKET_CATEGORIES: '/api/market/categories',
  MARKET_AGENTS: '/api/market/agents',
  MARKET_AGENT_DETAIL: (id: string) => `/api/market/agents/${id}`,
  MARKET_INSTALL: '/api/market/install',

  // 插件
  PLUGINS: '/api/plugins',
  PLUGIN_DETAIL: (id: string) => `/api/plugins/${id}`,
  PLUGIN_INVOKE: (id: string) => `/api/plugins/${id}/invoke`,

  // 自动化
  AUTOMATIONS: '/api/automations',
  AUTOMATION_DETAIL: (id: string) => `/api/automations/${id}`,
  AUTOMATION_TRIGGER: (id: string) => `/api/automations/${id}/trigger`,
  AUTOMATION_RUNS: (id: string) => `/api/automations/${id}/runs`,

  // 项目
  PROJECTS: '/api/projects',
  PROJECT_DETAIL: (id: string) => `/api/projects/${id}`,
  PROJECT_MEMBERS: (id: string) => `/api/projects/${id}/members`,

  // 文件上传
  UPLOAD: '/api/files/upload',
} as const;
