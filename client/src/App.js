import React, { useState } from 'react';
import VacationRequests from './components/VacationRequests';
import ManageSystem from './components/ManageSystem';

function App() {
  const [activeTab, setActiveTab] = useState('requests');

  return (
    <div className="container">
      <h1 style={{ marginBottom: '20px', color: '#333' }}>Vacation Request Management System</h1>
      
      <div className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          <span role="img" aria-label="beach vacation">🏖️</span> Vacation Requests
        </button>
        <button 
          className={`nav-tab ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          <span role="img" aria-label="settings">⚙️</span> Manage System
        </button>
      </div>

      {activeTab === 'requests' && <VacationRequests />}
      {activeTab === 'manage' && <ManageSystem />}
    </div>
  );
}

export default App;