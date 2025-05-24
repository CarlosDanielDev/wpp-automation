# WhatsApp Automation System - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Module Breakdown](#module-breakdown)
4. [Task Lists by Module](#task-lists-by-module)
5. [API Specifications](#api-specifications)
6. [Database Schema](#database-schema)
7. [Testing Strategy](#testing-strategy)
8. [Deployment Guide](#deployment-guide)
9. [Security Considerations](#security-considerations)

---

## Project Overview

### Purpose
Automated WhatsApp messaging system that reads Excel/CSV files, evaluates conditions, sends personalized messages via WhatsApp Web, and updates the spreadsheet with delivery status.

### Tech Stack
- **Frontend**: React + TypeScript + Vite + Pure CSS
- **Backend**: Node.js + Express + TypeScript
- **Automation**: Puppeteer
- **Real-time**: Socket.io
- **File Processing**: xlsx
- **File Upload**: Multer

### Key Features
1. Spreadsheet upload and parsing
2. Condition builder for filtering recipients
3. Message template editor with variables
4. WhatsApp Web automation
5. Real-time status updates
6. Spreadsheet status update
7. Batch processing with queuing
8. Session management
9. Error handling and retry logic
10. Audit logging

---

## System Architecture

### Component Diagram
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   React App     │────▶│   Express API   │────▶│   Puppeteer     │
│   (Frontend)    │     │   (Backend)     │     │   (WhatsApp)    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                         │
        │                       │                         │
        ▼                       ▼                         ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   File Upload   │     │   Queue System  │     │   WhatsApp Web  │
│   (Multer)      │     │   (In-Memory)   │     │   (Browser)     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Directory Structure
```
wpp-automation/
├── client/                    # Frontend React app
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── services/         # API services
│   │   ├── hooks/            # Custom hooks
│   │   ├── types/            # TypeScript types
│   │   ├── styles/           # CSS files
│   │   └── utils/            # Utility functions
│   ├── public/
│   └── vite.config.ts
├── server/                    # Backend Express app
│   ├── src/
│   │   ├── controllers/      # Route controllers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Express middleware
│   │   ├── utils/            # Utility functions
│   │   ├── types/            # TypeScript types
│   │   └── index.ts          # Entry point
│   └── tsconfig.json
├── shared/                    # Shared types/interfaces
│   └── types.ts
├── docs/                      # Additional documentation
├── tests/                     # Test files
└── package.json
```

---

## Module Breakdown

### 1. Frontend Modules

#### 1.1 File Upload Module
- **Purpose**: Handle file uploads with validation
- **Components**: FileUpload, FilePreview, FileValidator
- **Dependencies**: react-dropzone, axios

#### 1.2 Spreadsheet Viewer Module
- **Purpose**: Display and interact with spreadsheet data
- **Components**: SpreadsheetTable, ColumnSelector, CellEditor
- **Dependencies**: xlsx, react-table (optional)

#### 1.3 Condition Builder Module
- **Purpose**: Visual interface for creating conditions
- **Components**: ConditionBuilder, ConditionRow, OperatorSelector
- **Dependencies**: None (pure React)

#### 1.4 Message Template Module
- **Purpose**: Create and preview message templates
- **Components**: TemplateEditor, VariableSelector, MessagePreview
- **Dependencies**: None (pure React)

#### 1.5 Status Dashboard Module
- **Purpose**: Real-time monitoring of sending status
- **Components**: StatusDashboard, ProgressBar, StatusTable
- **Dependencies**: socket.io-client

#### 1.6 Settings Module
- **Purpose**: Configure app settings and WhatsApp session
- **Components**: Settings, SessionManager, ConfigForm
- **Dependencies**: None (pure React)

### 2. Backend Modules

#### 2.1 File Processing Module
- **Purpose**: Parse and validate uploaded files
- **Services**: FileParser, DataValidator, ColumnMapper
- **Dependencies**: xlsx, multer

#### 2.2 Condition Engine Module
- **Purpose**: Evaluate conditions against data
- **Services**: ConditionEvaluator, ExpressionParser
- **Dependencies**: None (pure TypeScript)

#### 2.3 WhatsApp Automation Module
- **Purpose**: Control WhatsApp Web via Puppeteer
- **Services**: WhatsAppBot, SessionManager, MessageSender
- **Dependencies**: puppeteer

#### 2.4 Queue Management Module
- **Purpose**: Handle message queuing and rate limiting
- **Services**: MessageQueue, RateLimiter, RetryManager
- **Dependencies**: None (in-memory implementation)

#### 2.5 WebSocket Module
- **Purpose**: Real-time communication with frontend
- **Services**: SocketManager, EventEmitter
- **Dependencies**: socket.io

#### 2.6 Logging Module
- **Purpose**: Audit trail and error logging
- **Services**: Logger, AuditTrail, ErrorReporter
- **Dependencies**: None (file-based)

---

## Task Lists by Module

### Frontend Tasks

#### Task 1: Project Setup
```
1.1. Initialize Vite project with React and TypeScript
1.2. Configure TypeScript for strict mode
1.3. Set up folder structure
1.4. Configure path aliases
1.5. Set up CSS architecture (CSS modules or styled approach)
1.6. Configure ESLint and Prettier
```

#### Task 2: File Upload Component
```
2.1. Create FileUpload component with react-dropzone
2.2. Add file type validation (xlsx, xls, csv)
2.3. Implement file size limit (10MB)
2.4. Create upload progress indicator
2.5. Add drag-and-drop styling
2.6. Implement file preview before upload
2.7. Create error handling for invalid files
```

#### Task 3: Spreadsheet Viewer Component
```
3.1. Create SpreadsheetTable component
3.2. Implement pagination for large files
3.3. Add column header display
3.4. Create row selection mechanism
3.5. Implement search/filter functionality
3.6. Add export functionality
3.7. Create loading states
```

#### Task 4: Condition Builder Component
```
4.1. Create ConditionBuilder container
4.2. Implement ConditionRow component
4.3. Create dropdown for column selection
4.4. Create operator selector (=, !=, >, <, contains, etc.)
4.5. Implement value input with type detection
4.6. Add AND/OR logic between conditions
4.7. Create condition preview/summary
4.8. Implement condition validation
```

#### Task 5: Message Template Component
```
5.1. Create TemplateEditor with textarea
5.2. Implement variable insertion ({{column_name}})
5.3. Create variable dropdown/autocomplete
5.4. Add character count
5.5. Implement template preview with sample data
5.6. Add template save/load functionality
5.7. Create emoji picker
```

#### Task 6: Status Dashboard Component
```
6.1. Create StatusDashboard container
6.2. Implement real-time progress bar
6.3. Create status table with columns (Phone, Status, Time, Error)
6.4. Add Socket.io connection for real-time updates
6.5. Implement status filtering (sent, failed, pending)
6.6. Add export results functionality
6.7. Create retry failed messages button
```

#### Task 7: API Service Layer
```
7.1. Create axios instance with interceptors
7.2. Implement file upload service
7.3. Create condition evaluation service
7.4. Implement message sending service
7.5. Create session management service
7.6. Add error handling and retry logic
7.7. Implement request/response type safety
```

### Backend Tasks

#### Task 8: Express Server Setup
```
8.1. Initialize Express with TypeScript
8.2. Configure middleware (cors, body-parser)
8.3. Set up multer for file uploads
8.4. Configure Socket.io
8.5. Create error handling middleware
8.6. Set up route structure
8.7. Configure environment variables
```

#### Task 9: File Processing Service
```
9.1. Create FileParser class for xlsx/csv
9.2. Implement column detection
9.3. Add data validation
9.4. Create phone number normalization
9.5. Implement batch processing for large files
9.6. Add memory-efficient streaming
9.7. Create file cleanup routine
```

#### Task 10: Condition Engine
```
10.1. Create ConditionEvaluator class
10.2. Implement comparison operators
10.3. Add string operations (contains, starts with)
10.4. Implement date comparisons
10.5. Add numeric comparisons
10.6. Create AND/OR logic evaluator
10.7. Add condition validation
```

#### Task 11: WhatsApp Automation Service
```
11.1. Create WhatsAppBot class
11.2. Implement browser launch with Puppeteer
11.3. Create QR code scanning flow
11.4. Implement session persistence
11.5. Create message sending function
11.6. Add contact search functionality
11.7. Implement error detection (banned, disconnected)
11.8. Create screenshot capture for debugging
11.9. Add message delivery confirmation
11.10. Implement browser cleanup
```

#### Task 12: Queue Management
```
12.1. Create MessageQueue class
12.2. Implement FIFO queue structure
12.3. Add rate limiting (30 messages/minute)
12.4. Create retry mechanism for failed messages
12.5. Implement priority queue for urgent messages
12.6. Add queue persistence
12.7. Create queue monitoring
```

#### Task 13: WebSocket Events
```
13.1. Create SocketManager class
13.2. Implement connection handling
13.3. Create event emitters for:
    - Upload progress
    - Processing status
    - Message sent
    - Message failed
    - Queue status
13.4. Add room-based isolation
13.5. Implement reconnection logic
```

#### Task 14: Spreadsheet Update Service
```
14.1. Create SpreadsheetUpdater class
14.2. Implement status column addition
14.3. Add timestamp column
14.4. Create cell formatting (colors)
14.5. Implement batch updates
14.6. Add backup before modification
14.7. Create download endpoint
```

---

## API Specifications

### REST Endpoints

#### 1. File Upload
```typescript
POST /api/upload
Content-Type: multipart/form-data

Request:
- file: File (xlsx, xls, csv)

Response:
{
  "fileId": "string",
  "fileName": "string",
  "rowCount": number,
  "columns": string[],
  "preview": object[]
}
```

#### 2. Evaluate Conditions
```typescript
POST /api/evaluate
Content-Type: application/json

Request:
{
  "fileId": "string",
  "conditions": [
    {
      "column": "string",
      "operator": "equals" | "not_equals" | "contains" | "greater" | "less",
      "value": "any",
      "logic": "AND" | "OR"
    }
  ]
}

Response:
{
  "matchCount": number,
  "matches": object[],
  "phoneNumbers": string[]
}
```

#### 3. Send Messages
```typescript
POST /api/send
Content-Type: application/json

Request:
{
  "fileId": "string",
  "template": "string",
  "phoneNumbers": string[],
  "testMode": boolean
}

Response:
{
  "jobId": "string",
  "totalMessages": number,
  "status": "queued"
}
```

#### 4. Get Job Status
```typescript
GET /api/status/:jobId

Response:
{
  "jobId": "string",
  "status": "running" | "completed" | "failed",
  "progress": {
    "total": number,
    "sent": number,
    "failed": number,
    "pending": number
  },
  "results": [
    {
      "phone": "string",
      "status": "sent" | "failed",
      "error": "string?",
      "timestamp": "string"
    }
  ]
}
```

#### 5. WhatsApp Session
```typescript
GET /api/whatsapp/status
Response:
{
  "connected": boolean,
  "phoneNumber": "string?",
  "qrCode": "string?"
}

POST /api/whatsapp/connect
Response:
{
  "status": "connecting",
  "qrCode": "string"
}

POST /api/whatsapp/disconnect
Response:
{
  "status": "disconnected"
}
```

### WebSocket Events

#### Client to Server
```typescript
// Join job room
socket.emit('join-job', { jobId: string })

// Leave job room
socket.emit('leave-job', { jobId: string })

// Request status update
socket.emit('request-status', { jobId: string })
```

#### Server to Client
```typescript
// Job progress update
socket.emit('job-progress', {
  jobId: string,
  progress: {
    total: number,
    sent: number,
    failed: number,
    pending: number
  }
})

// Message status update
socket.emit('message-status', {
  jobId: string,
  phone: string,
  status: 'sending' | 'sent' | 'failed',
  error?: string,
  timestamp: string
})

// WhatsApp connection status
socket.emit('whatsapp-status', {
  connected: boolean,
  phoneNumber?: string,
  qrCode?: string
})
```

---

## Database Schema

### In-Memory Data Structures

#### 1. Uploaded Files
```typescript
interface UploadedFile {
  id: string;
  fileName: string;
  uploadTime: Date;
  data: any[][];
  headers: string[];
  phoneColumn?: string;
}

const uploadedFiles = new Map<string, UploadedFile>();
```

#### 2. Jobs
```typescript
interface Job {
  id: string;
  fileId: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  template: string;
  conditions: Condition[];
  totalMessages: number;
  sentCount: number;
  failedCount: number;
  createdAt: Date;
  completedAt?: Date;
}

const jobs = new Map<string, Job>();
```

#### 3. Message Queue
```typescript
interface QueuedMessage {
  jobId: string;
  phone: string;
  message: string;
  data: Record<string, any>;
  retryCount: number;
  priority: number;
}

const messageQueue: QueuedMessage[] = [];
```

#### 4. Session Storage
```typescript
interface WhatsAppSession {
  id: string;
  connected: boolean;
  phoneNumber?: string;
  cookies?: any[];
  lastActivity: Date;
}

let currentSession: WhatsAppSession | null = null;
```

---

## Testing Strategy

### Unit Tests

#### Frontend Tests
```
1. Component rendering tests
2. File upload validation
3. Condition builder logic
4. Template variable replacement
5. API service mocking
```

#### Backend Tests
```
1. File parsing accuracy
2. Condition evaluation
3. Queue management
4. Phone number validation
5. Template rendering
```

### Integration Tests
```
1. File upload flow
2. Condition evaluation flow
3. Message sending flow
4. WebSocket communication
5. Session management
```

### E2E Tests
```
1. Complete workflow test
2. Error handling scenarios
3. Large file handling
4. Concurrent user testing
5. Session recovery
```

---

## Deployment Guide

### Development Setup
```bash
# Clone repository
git clone <repository-url>

# Install dependencies
npm install

# Start backend
npm run server:dev

# Start frontend
npm run client:dev
```

### Production Build
```bash
# Build frontend
npm run client:build

# Build backend
npm run server:build

# Start production
npm run start
```

### Environment Variables
```env
# Server
PORT=3001
NODE_ENV=production
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
RATE_LIMIT=30

# WhatsApp
HEADLESS=false
USER_DATA_DIR=./whatsapp-session
WHATSAPP_TIMEOUT=60000

# Security
SESSION_SECRET=your-secret-key
ALLOWED_ORIGINS=http://localhost:5173
```

### Docker Deployment
```dockerfile
FROM node:18-slim

# Install Puppeteer dependencies
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    xdg-utils

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001
CMD ["npm", "start"]
```

---

## Security Considerations

### 1. Input Validation
- Sanitize all user inputs
- Validate file types and sizes
- Escape template variables
- Validate phone numbers

### 2. Rate Limiting
- Implement per-IP rate limiting
- Queue-based message throttling
- Prevent WhatsApp bans

### 3. Session Security
- Encrypt stored sessions
- Implement session timeout
- Secure cookie handling

### 4. Data Privacy
- Don't store sensitive data
- Implement data retention policy
- Add GDPR compliance

### 5. Error Handling
- Never expose internal errors
- Log security events
- Implement monitoring

---

## Additional Features (Future)

### 1. Advanced Features
- Multiple WhatsApp accounts
- Scheduled messaging
- Media attachments
- Group messaging
- Contact import from vCard

### 2. Analytics
- Message delivery reports
- Campaign performance
- A/B testing
- Conversion tracking

### 3. Integrations
- CRM integration
- Webhook support
- API for external systems
- Zapier integration

### 4. UI Enhancements
- Dark mode
- Mobile responsive
- Keyboard shortcuts
- Bulk operations

---

## Troubleshooting Guide

### Common Issues

#### 1. WhatsApp Connection Failed
- Check internet connection
- Clear browser cache
- Update Puppeteer
- Check for WhatsApp Web updates

#### 2. Messages Not Sending
- Verify phone number format
- Check rate limits
- Ensure session is active
- Review message content

#### 3. File Upload Errors
- Check file format
- Verify file size
- Ensure proper headers
- Check column names

#### 4. Performance Issues
- Implement pagination
- Use streaming for large files
- Optimize Puppeteer settings
- Add caching layer

---

## Maintenance Tasks

### Daily
- Monitor error logs
- Check queue status
- Verify session health

### Weekly
- Clear old uploads
- Review performance metrics
- Update dependencies

### Monthly
- Security audit
- Performance optimization
- Feature usage analysis

---

## References

### Documentation Links
- [Puppeteer Documentation](https://pptr.dev/)
- [Socket.io Documentation](https://socket.io/docs/)
- [Express Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

### Useful Resources
- [WhatsApp Web Reverse Engineering](https://github.com/sigalor/whatsapp-web-reveng)
- [Puppeteer Best Practices](https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

## Contact & Support

### Project Maintainer
- GitHub: @CarlosDanielDev
- Repository: https://github.com/CarlosDanielDev/wpp-automation

### Reporting Issues
1. Check existing issues
2. Provide detailed description
3. Include error logs
4. Share reproduction steps

---

## Version History

### v1.0.0 (Current)
- Initial release
- Basic spreadsheet processing
- WhatsApp Web automation
- Real-time status updates

### Roadmap
- v1.1.0: Media support
- v1.2.0: Scheduling features
- v1.3.0: Multi-account support
- v2.0.0: WhatsApp Business API integration