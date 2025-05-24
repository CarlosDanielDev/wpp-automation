import React from 'react';

interface MessageTemplateProps {
  fileId: string | null;
}

const MessageTemplate: React.FC<MessageTemplateProps> = ({ fileId }) => {
  return (
    <div className="component-placeholder">
      <h2>✉️ Message Template</h2>
      <p>Create your message template with variables</p>
      {fileId ? (
        <p>Working with file: {fileId}</p>
      ) : (
        <p>Please upload a file first</p>
      )}
      {/* TODO: Implement message template editor */}
    </div>
  );
};

export default MessageTemplate;
