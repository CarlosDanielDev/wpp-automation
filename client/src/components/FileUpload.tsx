import React from 'react';

interface FileUploadProps {
  onFileUploaded: (fileId: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded }) => {
  return (
    <div className="component-placeholder">
      <h2>📄 File Upload</h2>
      <p>Upload your Excel or CSV file here</p>
      {/* TODO: Implement file upload functionality */}
      <div style={{ padding: '20px', border: '2px dashed #ccc', textAlign: 'center' }}>
        <p>Drag and drop your file here or click to browse</p>
        <input type="file" accept=".xlsx,.xls,.csv" />
      </div>
    </div>
  );
};

export default FileUpload; 