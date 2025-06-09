import React, { useState } from 'react';
import VacationRequests from './components/VacationRequests';
import ManageSystem from './components/ManageSystem';
import Login from './components/Login';

function App() {
  const [user, setUser] = useState(() => (localStorage.getItem('token') ? {} : null));
  const [activeTab, setActiveTab] = useState('requests');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className="container">
      <button className="btn btn-secondary" onClick={handleLogout} style={{ float: 'right' }}>Logout</button>
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