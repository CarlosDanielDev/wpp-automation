import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileParserService } from '../services/FileParserService.js';
import { asyncHandler, createError } from '../middleware/errorHandler.js';
import type { FileUploadResponse, ApiResponse } from '@shared/types.js';

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${uuidv4()}-${Date.now()}`;
    const extension = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${extension}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['.xlsx', '.xls', '.csv'];
  const extension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(extension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only .xlsx, .xls, and .csv files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB default
    files: 1
  }
});

const fileParser = new FileParserService();

// POST /api/upload - Upload and parse file
router.post('/', upload.single('file'), asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) {
    throw createError('No file uploaded', 400, 'FILE_UPLOAD_ERROR');
  }

  try {
    const result = await fileParser.parseFile(req.file);
    
    const response: ApiResponse<FileUploadResponse> = {
      success: true,
      data: result,
      message: 'File uploaded and parsed successfully'
    };

    res.json(response);
  } catch (error) {
    // Clean up uploaded file on error
    await fileParser.cleanupFile(req.file.path);
    throw error;
  }
}));

// GET /api/upload/:fileId - Get file info
router.get('/:fileId', asyncHandler(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  
  const fileInfo = await fileParser.getFileInfo(fileId);
  
  if (!fileInfo) {
    throw createError('File not found', 404, 'FILE_UPLOAD_ERROR');
  }

  const response: ApiResponse = {
    success: true,
    data: fileInfo,
    message: 'File info retrieved successfully'
  };

  res.json(response);
}));

// GET /api/upload/:fileId/preview - Get file preview
router.get('/:fileId/preview', asyncHandler(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  
  const preview = await fileParser.getFilePreview(fileId, page, limit);
  
  if (!preview) {
    throw createError('File not found', 404, 'FILE_UPLOAD_ERROR');
  }

  const response: ApiResponse = {
    success: true,
    data: preview,
    message: 'File preview retrieved successfully'
  };

  res.json(response);
}));

// DELETE /api/upload/:fileId - Delete uploaded file
router.delete('/:fileId', asyncHandler(async (req: Request, res: Response) => {
  const { fileId } = req.params;
  
  await fileParser.deleteFile(fileId);
  
  const response: ApiResponse = {
    success: true,
    message: 'File deleted successfully'
  };

  res.json(response);
}));

export default router; 