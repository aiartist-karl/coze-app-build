/**
 * 全局 API 类型定义
 * 所有 ID 是雪花 int64，JSON 中作字符串传输
 */

export type SnowflakeId = string;

export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface ApiResponse<T = any> {
  code: number;
  msg: string;
  data: T;
}

// ============ 用户 ============
export interface UserInfo {
  id: SnowflakeId;
  name: string;
  avatar_url?: string;
  email?: string;
  mobile?: string;
  workspace_id?: SnowflakeId;
  created_at: SnowflakeId;
}

export interface LoginRequest {
  account: string;
  password: string;
  login_type: 'password' | 'sms_code' | 'email_code';
  code?: string;
}

export interface RegisterRequest {
  account: string;
  password: string;
  code: string;
  nickname?: string;
  register_type: 'mobile' | 'email';
}

export interface LoginResponse {
  session_id: string;
  user: UserInfo;
  pat_token?: string;
  expires_at: number;
}

// ============ Bot / Agent ============
export interface BotInfo {
  id: SnowflakeId;
  name: string;
  description?: string;
  avatar_url?: string;
  icon_url?: string;
  prompt_info?: { system_prompt?: string };
  onboarding_info?: { prologue?: string; suggested_questions?: string[] };
  model_config?: { model_id: string; temperature?: number; top_p?: number; max_tokens?: number };
  plugin_info_list?: BotPluginBinding[];
  knowledge_ids?: SnowflakeId[];
  workflow_ids?: SnowflakeId[];
  database_ids?: SnowflakeId[];
  connector_ids: SnowflakeId[];
  workspace_id: SnowflakeId;
  status: 0 | 1;
  published: boolean;
  created_at: SnowflakeId;
  updated_at: SnowflakeId;
}

export interface BotPluginBinding {
  plugin_id: SnowflakeId;
  name: string;
  description?: string;
  icon_url?: string;
  tool_names: string[];
}

export interface CreateBotRequest {
  name: string;
  description?: string;
  avatar_file_id?: SnowflakeId;
  prompt_info?: { system_prompt?: string };
  onboarding_info?: { prologue?: string; suggested_questions?: string[] };
  connector_ids?: SnowflakeId[];
}

export interface PublishBotRequest {
  bot_id: SnowflakeId;
  connector_ids: SnowflakeId[];
  version_desc?: string;
}

// ============ 聊天 ============
export type RoleType = 'user' | 'assistant' | 'system' | 'tool';
export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'card' | 'interactive';

export interface ChatMessage {
  id: SnowflakeId;
  conversation_id: SnowflakeId;
  bot_id?: SnowflakeId;
  role: RoleType;
  type: MessageType;
  content: string;
  content_type?: 'text' | 'markdown' | 'image_url' | 'file_url' | 'object_string';
  tool_calls?: ToolCall[];
  tool_response?: ToolResponse;
  user_id?: SnowflakeId;
  created_at: SnowflakeId;
  updated_at: SnowflakeId;
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

export interface ToolResponse {
  tool_call_id: string;
  output: string;
}

export interface ConversationInfo {
  id: SnowflakeId;
  bot_id: SnowflakeId;
  name?: string;
  last_message?: ChatMessage;
  message_count?: number;
  workspace_id: SnowflakeId;
  user_id: SnowflakeId;
  created_at: SnowflakeId;
  updated_at: SnowflakeId;
}

export interface CreateConversationRequest {
  bot_id: SnowflakeId;
  name?: string;
}

export interface SendMessageRequest {
  conversation_id?: SnowflakeId;
  bot_id: SnowflakeId;
  role: RoleType;
  content: string;
  content_type?: 'text' | 'markdown' | 'image_url' | 'file_url' | 'object_string';
  files?: ChatFile[];
  auto_save_history?: boolean;
  stream?: boolean;
}

export interface ChatFile {
  file_id: SnowflakeId;
  file_name?: string;
  file_type?: 'image' | 'document' | 'audio' | 'video';
  file_url?: string;
  file_size?: number;
}

export type SseEventType =
  | 'message' | 'conversation.message.delta' | 'conversation.message.completed'
  | 'conversation.chat.in_progress' | 'conversation.chat.completed'
  | 'conversation.chat.failed' | 'done' | 'error';

export interface SseEvent {
  event: SseEventType;
  data: any;
}

export interface MessageDelta {
  message_id?: SnowflakeId;
  conversation_id?: SnowflakeId;
  type?: MessageType;
  role?: RoleType;
  content?: string;
  content_type?: string;
  tool_calls?: ToolCall[];
  is_final?: boolean;
}

export interface ChatUsage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

// ============ 知识库 ============
export interface KnowledgeInfo {
  id: SnowflakeId;
  name: string;
  description?: string;
  icon_url?: string;
  doc_count?: number;
  workspace_id: SnowflakeId;
  created_at: SnowflakeId;
  updated_at: SnowflakeId;
}

export interface KnowledgeDocument {
  id: SnowflakeId;
  knowledge_id: SnowflakeId;
  name: string;
  source_type: 'upload_file' | 'online_web' | 'custom_text' | 'custom_api';
  format_type?: string;
  char_count?: number;
  status: number;
  slice_count?: number;
  created_at: SnowflakeId;
}

export interface SearchKnowledgeRequest {
  knowledge_ids: SnowflakeId[];
  query: string;
  top_k?: number;
  search_type?: 'hybrid' | 'semantic' | 'keyword';
}

export interface SearchKnowledgeResult {
  document_id: SnowflakeId;
  document_name: string;
  score: number;
  content: string;
  slice_index?: number;
}

// ============ 工作流 ============
export interface WorkflowInfo {
  id: SnowflakeId;
  name: string;
  description?: string;
  icon_url?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables?: WorkflowVariable[];
  version?: string;
  status: 0 | 1;
  workspace_id: SnowflakeId;
  created_at: SnowflakeId;
  updated_at: SnowflakeId;
}

export interface WorkflowNode {
  id: string;
  type: 'start' | 'end' | 'llm' | 'plugin' | 'knowledge' | 'condition' | 'loop' | 'code' | 'http' | 'variable';
  name: string;
  x?: number;
  y?: number;
  config: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface WorkflowVariable {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  default_value?: any;
  description?: string;
}

export interface RunWorkflowRequest {
  workflow_id: SnowflakeId;
  parameters?: Record<string, any>;
  stream?: boolean;
}

export interface WorkflowRunResult {
  run_id: SnowflakeId;
  status: 'running' | 'success' | 'failed';
  output?: Record<string, any>;
  error_message?: string;
  duration_ms?: number;
}

// ============ 数据库 Memory ============
export interface DatabaseInfo {
  id: SnowflakeId;
  name: string;
  description?: string;
  fields: DatabaseField[];
  workspace_id: SnowflakeId;
  created_at: SnowflakeId;
}

export interface DatabaseField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object' | 'array';
  is_required?: boolean;
  is_indexed?: boolean;
  default_value?: any;
}

export interface DatabaseRow {
  id: SnowflakeId;
  database_id: SnowflakeId;
  data: Record<string, any>;
  created_at: SnowflakeId;
  updated_at: SnowflakeId;
}

export interface VariableMemory {
  id: SnowflakeId;
  bot_id?: SnowflakeId;
  user_id?: SnowflakeId;
  key: string;
  value: any;
  value_type: 'string' | 'number' | 'boolean' | 'object';
  description?: string;
  updated_at: SnowflakeId;
}

// ============ 市场 ============
export interface MarketAgentItem {
  id: SnowflakeId;
  name: string;
  description: string;
  icon_url?: string;
  categories: string[];
  author?: string;
  star_count?: number;
  use_count?: number;
  rating?: number;
  tags?: string[];
  is_official?: boolean;
  published_at: SnowflakeId;
}

export interface MarketCategory {
  id: string;
  name: string;
  icon_url?: string;
  sort?: number;
}

// ============ 插件 ============
export interface PluginInfo {
  id: SnowflakeId;
  name: string;
  description?: string;
  icon_url?: string;
  version?: string;
  plugin_type: 'builtin' | 'custom' | 'openapi';
  tool_count?: number;
  tools?: PluginTool[];
  workspace_id?: SnowflakeId;
  created_at: SnowflakeId;
}

export interface PluginTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

// ============ 自动化 ============
export interface AutomationFlow {
  id: SnowflakeId;
  name: string;
  description?: string;
  trigger: { type: 'schedule' | 'webhook' | 'event'; config: Record<string, any> };
  actions: { type: string; config: Record<string, any> }[];
  enabled: boolean;
  workspace_id: SnowflakeId;
  created_at: SnowflakeId;
}

export interface AutomationRunLog {
  id: SnowflakeId;
  flow_id: SnowflakeId;
  status: 'success' | 'failed' | 'running';
  trigger_time: number;
  error_message?: string;
  output?: Record<string, any>;
}

// ============ 项目 ============
export interface ProjectInfo {
  id: SnowflakeId;
  name: string;
  description?: string;
  icon_url?: string;
  project_type: 'chat' | 'code' | 'video' | 'general';
  bot_ids: SnowflakeId[];
  member_ids: SnowflakeId[];
  workspace_id: SnowflakeId;
  owner_id: SnowflakeId;
  status: 'active' | 'archived';
  created_at: SnowflakeId;
  updated_at: SnowflakeId;
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  project_type: 'chat' | 'code' | 'video' | 'general';
  bot_ids?: SnowflakeId[];
}
