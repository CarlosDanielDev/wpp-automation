// Shared types for WhatsApp Automation System

// File Upload Types
export interface UploadedFile {
  id: string;
  fileName: string;
  uploadTime: Date;
  data: any[][];
  headers: string[];
  phoneColumn?: string;
  rowCount: number;
}

export interface FileUploadResponse {
  fileId: string;
  fileName: string;
  rowCount: number;
  columns: string[];
  preview: any[];
}

// Condition Types
export type ConditionOperator = 
  | 'equals' 
  | 'not_equals' 
  | 'contains' 
  | 'not_contains'
  | 'starts_with'
  | 'ends_with'
  | 'greater' 
  | 'less' 
  | 'greater_equal'
  | 'less_equal'
  | 'is_empty'
  | 'is_not_empty';

export type ConditionLogic = 'AND' | 'OR';

export interface Condition {
  id: string;
  column: string;
  operator: ConditionOperator;
  value: any;
  logic?: ConditionLogic;
}

export interface ConditionEvaluationRequest {
  fileId: string;
  conditions: Condition[];
}

export interface ConditionEvaluationResponse {
  matchCount: number;
  matches: any[];
  phoneNumbers: string[];
}

// Message Types
export interface MessageTemplate {
  id?: string;
  name?: string;
  content: string;
  variables: string[];
}

export interface SendMessageRequest {
  fileId: string;
  template: string;
  phoneNumbers: string[];
  testMode?: boolean;
}

export interface SendMessageResponse {
  jobId: string;
  totalMessages: number;
  status: 'queued';
}

// Job and Status Types
export type JobStatus = 'queued' | 'running' | 'completed' | 'failed' | 'paused';
export type MessageStatus = 'pending' | 'sending' | 'sent' | 'failed' | 'retry';

export interface Job {
  id: string;
  fileId: string;
  status: JobStatus;
  template: string;
  conditions: Condition[];
  totalMessages: number;
  sentCount: number;
  failedCount: number;
  pendingCount: number;
  createdAt: Date;
  completedAt?: Date;
  startedAt?: Date;
  progress: JobProgress;
}

export interface JobProgress {
  total: number;
  sent: number;
  failed: number;
  pending: number;
  percentage: number;
}

export interface MessageResult {
  phone: string;
  status: MessageStatus;
  error?: string;
  timestamp: string;
  retryCount: number;
  data?: Record<string, any>;
}

export interface JobStatusResponse {
  jobId: string;
  status: JobStatus;
  progress: JobProgress;
  results: MessageResult[];
  estimatedTimeRemaining?: number;
}

// Queue Types
export interface QueuedMessage {
  id: string;
  jobId: string;
  phone: string;
  message: string;
  data: Record<string, any>;
  retryCount: number;
  priority: number;
  scheduledAt?: Date;
  attempts: MessageAttempt[];
}

export interface MessageAttempt {
  timestamp: Date;
  status: MessageStatus;
  error?: string;
  screenshot?: string;
}

// WhatsApp Session Types
export type SessionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface WhatsAppSession {
  id: string;
  connected: boolean;
  phoneNumber?: string;
  qrCode?: string;
  lastActivity: Date;
  status: SessionStatus;
  cookies?: any[];
}

export interface WhatsAppStatusResponse {
  connected: boolean;
  phoneNumber?: string;
  qrCode?: string;
  status: SessionStatus;
}

export interface WhatsAppConnectResponse {
  status: 'connecting';
  qrCode: string;
}

// WebSocket Event Types
export interface SocketEvents {
  // Client to Server
  'join-job': { jobId: string };
  'leave-job': { jobId: string };
  'request-status': { jobId: string };
  'pause-job': { jobId: string };
  'resume-job': { jobId: string };
  'cancel-job': { jobId: string };

  // Server to Client
  'job-progress': {
    jobId: string;
    progress: JobProgress;
    estimatedTimeRemaining?: number;
  };
  'message-status': {
    jobId: string;
    phone: string;
    status: MessageStatus;
    error?: string;
    timestamp: string;
  };
  'whatsapp-status': WhatsAppStatusResponse;
  'job-completed': { jobId: string };
  'job-failed': { jobId: string; error: string };
  'error': { message: string; code?: string };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Settings Types
export interface AppSettings {
  whatsapp: {
    rateLimitPerMinute: number;
    retryAttempts: number;
    retryDelay: number;
    headless: boolean;
    timeout: number;
  };
  upload: {
    maxFileSize: number;
    allowedTypes: string[];
  };
  general: {
    maxConcurrentJobs: number;
    sessionTimeout: number;
  };
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export type ErrorCode = 
  | 'FILE_UPLOAD_ERROR'
  | 'FILE_PARSE_ERROR'
  | 'CONDITION_EVALUATION_ERROR'
  | 'WHATSAPP_CONNECTION_ERROR'
  | 'WHATSAPP_SEND_ERROR'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SESSION_EXPIRED'
  | 'INVALID_PHONE_NUMBER'
  | 'TEMPLATE_RENDER_ERROR'
  | 'JOB_NOT_FOUND'
  | 'UNKNOWN_ERROR';

// Utility Types
export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type Required<T, K extends keyof T> = T & { [P in K]-?: T[P] }; 