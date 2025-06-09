import React, { useState } from 'react';
import EmployeeManager from './EmployeeManager';
import LocationManager from './LocationManager';
import DenialReasonManager from './DenialReasonManager';
import Dashboard from './Dashboard';

function ManageSystem() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div>
      <div className="nav-tabs" style={{ marginBottom: '20px' }}>
        <button 
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <span role="img" aria-label="dashboard">📊</span> System Dashboard
        </button>
        <button 
          className={`nav-tab ${activeTab === 'employees' ? 'active' : ''}`}
          onClick={() => setActiveTab('employees')}
        >
          <span role="img" aria-label="employees">👥</span> Employees
        </button>
        <button 
          className={`nav-tab ${activeTab === 'locations' ? 'active' : ''}`}
          onClick={() => setActiveTab('locations')}
        >
          <span role="img" aria-label="locations">📍</span> Locations
        </button>
        <button 
          className={`nav-tab ${activeTab === 'denial-reasons' ? 'active' : ''}`}
          onClick={() => setActiveTab('denial-reasons')}
        >
          <span role="img" aria-label="denial reasons">❌</span> Denial Reasons
        </button>
      </div>

      {activeTab === 'dashboard' && <Dashboard />}
      {activeTab === 'employees' && <EmployeeManager />}
      {activeTab === 'locations' && <LocationManager />}
      {activeTab === 'denial-reasons' && <DenialReasonManager />}
    </div>
  );
}

export default ManageSystem;