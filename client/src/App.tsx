import React, { useState } from 'react';
import './styles/App.css';

// Import components (to be implemented)
import FileUpload from './components/FileUpload';
import SpreadsheetViewer from './components/SpreadsheetViewer';
import ConditionBuilder from './components/ConditionBuilder';
import MessageTemplate from './components/MessageTemplate';
import StatusDashboard from './components/StatusDashboard';
import Settings from './components/Settings';

type ActiveTab = 'upload' | 'conditions' | 'template' | 'status' | 'settings';

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('upload');
  const [fileId, setFileId] = useState<string | null>(null);

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'upload':
        return <FileUpload onFileUploaded={setFileId} />;
      case 'conditions':
        return <ConditionBuilder fileId={fileId} />;
      case 'template':
        return <MessageTemplate fileId={fileId} />;
      case 'status':
        return <StatusDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <FileUpload onFileUploaded={setFileId} />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📱 WhatsApp Automation</h1>
        <p>Send personalized messages from your spreadsheet data</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-button ${activeTab === 'upload' ? 'active' : ''}`}
          onClick={() => setActiveTab('upload')}
        >
          📄 Upload File
        </button>
        <button
          className={`nav-button ${activeTab === 'conditions' ? 'active' : ''}`}
          onClick={() => setActiveTab('conditions')}
          disabled={!fileId}
        >
          🔍 Conditions
        </button>
        <button
          className={`nav-button ${activeTab === 'template' ? 'active' : ''}`}
          onClick={() => setActiveTab('template')}
          disabled={!fileId}
        >
          ✉️ Template
        </button>
        <button
          className={`nav-button ${activeTab === 'status' ? 'active' : ''}`}
          onClick={() => setActiveTab('status')}
        >
          📊 Status
        </button>
        <button
          className={`nav-button ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ Settings
        </button>
      </nav>

      <main className="app-main">
        {renderActiveComponent()}
      </main>

      <footer className="app-footer">
        <p>WhatsApp Automation System v1.0.0</p>
      </footer>
    </div>
  );
}

export default App; 