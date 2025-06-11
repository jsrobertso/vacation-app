import React, { useState } from 'react';
import VacationRequests from './components/VacationRequests';
import ManageSystem from './components/ManageSystem';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
      return {};
    }
  });
  const [activeTab, setActiveTab] = useState('requests');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="container">
      <div style={{ float: 'right', display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>{user.email}</span>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>
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