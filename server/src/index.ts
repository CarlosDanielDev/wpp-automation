import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import uploadRoutes from './controllers/uploadController.js';
import conditionRoutes from './controllers/conditionController.js';
import messageRoutes from './controllers/messageController.js';
import whatsappRoutes from './controllers/whatsappController.js';
import jobRoutes from './controllers/jobController.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';

// Import services
import { SocketManager } from './services/SocketManager.js';
import { WhatsAppBot } from './services/WhatsAppBot.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Port configuration
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Apply rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/conditions', conditionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/jobs', jobRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '../../client/dist');
  app.use(express.static(clientDistPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize services
const socketManager = new SocketManager(io);
const whatsappBot = new WhatsAppBot(socketManager);

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  
  // Close WhatsApp browser
  await whatsappBot.cleanup();
  
  // Close server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`
🚀 WhatsApp Automation Server is running!
📡 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
📁 Upload Directory: ${process.env.UPLOAD_DIR || './uploads'}
⚡ Socket.IO: Enabled
🤖 WhatsApp Bot: Ready
  `);
});

export { io, socketManager, whatsappBot }; 