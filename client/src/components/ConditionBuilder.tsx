import React from 'react';

interface ConditionBuilderProps {
  fileId: string | null;
}

const ConditionBuilder: React.FC<ConditionBuilderProps> = ({ fileId }) => {
  return (
    <div className="component-placeholder">
      <h2>🔍 Condition Builder</h2>
      <p>Build conditions to filter your recipients</p>
      {fileId ? (
        <p>Working with file: {fileId}</p>
      ) : (
        <p>Please upload a file first</p>
      )}
      {/* TODO: Implement condition builder */}
    </div>
  );
};

export default ConditionBuilder;
