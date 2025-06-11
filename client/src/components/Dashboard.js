import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState(null);
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const API_BASE = 'http://localhost:3001';

  const fetchDashboardData = async () => {
    try {
    const [statsRes, activityRes, healthRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/activity'),
        api.get('/health', { baseURL: API_BASE })
      ]);

      setStats(statsRes.data);
      setActivity(activityRes.data);
      setHealth(healthRes.data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data. Make sure the server is running on port 3001.');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const formatMemory = (bytes) => {
    return `${Math.round(bytes / 1024 / 1024)}MB`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'approved': return '#28a745';
      case 'denied': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Dashboard Error</h4>
          <p>{error}</p>
          <hr />
          <p className="mb-0">
            <button className="btn btn-outline-danger" onClick={fetchDashboardData}>
              Retry Connection
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1><span role="img" aria-label="dashboard">📊</span> System Dashboard</h1>
        <div className="d-flex align-items-center gap-3">
          <small className="text-muted">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </small>
          <button 
            className="btn btn-outline-primary btn-sm" 
            onClick={fetchDashboardData}
          >
            <span role="img" aria-label="refresh">🔄</span> Refresh
          </button>
        </div>
      </div>

      {/* Connection Information */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card border-primary">
            <div className="card-header bg-primary text-white">
              <h6 className="mb-0"><span role="img" aria-label="computer">🖥️</span> Frontend (React)</h6>
            </div>
            <div className="card-body">
              <p><strong>Host:</strong> {stats?.connections?.frontend?.host || 'localhost'}</p>
              <p><strong>Port:</strong> {stats?.connections?.frontend?.port || '3000'}</p>
              <p><strong>URL:</strong> <a href={stats?.connections?.frontend?.url || 'http://localhost:3000'} target="_blank" rel="noopener noreferrer">{stats?.connections?.frontend?.url || 'http://localhost:3000'}</a></p>
              <p><strong>Protocol:</strong> {stats?.connections?.frontend?.protocol || 'HTTP'}</p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h6 className="mb-0"><span role="img" aria-label="lightning">⚡</span> Backend (Node.js)</h6>
            </div>
            <div className="card-body">
              <p><strong>Host:</strong> {stats?.connections?.backend?.host || 'localhost'}</p>
              <p><strong>Port:</strong> {stats?.connections?.backend?.port || '3001'}</p>
              <p><strong>URL:</strong> <a href={stats?.connections?.backend?.url || 'http://localhost:3001'} target="_blank" rel="noopener noreferrer">{stats?.connections?.backend?.url || 'http://localhost:3001'}</a></p>
              <p><strong>Status:</strong> <span className="badge bg-success">{health?.status || 'Unknown'}</span></p>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-info">
            <div className="card-header bg-info text-white">
              <h6 className="mb-0"><span role="img" aria-label="database">🗄️</span> Database (MongoDB)</h6>
            </div>
            <div className="card-body">
              <p><strong>Host:</strong> {stats?.connections?.database?.host || 'localhost'}</p>
              <p><strong>Port:</strong> {stats?.connections?.database?.port || '27017'}</p>
              <p><strong>Database:</strong> {stats?.connections?.database?.database || 'vacation_app'}</p>
              <p><strong>Status:</strong> <span className="badge bg-info">{stats?.connections?.database?.status || 'Unknown'}</span></p>
              <div className="mt-2">
                <small><strong>Connection String:</strong></small><br />
                <code style={{fontSize: '10px', wordBreak: 'break-all'}}>
                  {stats?.connections?.database?.connectionString || 'mongodb://localhost:27017/vacation_app'}
                </code>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health Summary */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0"><span role="img" aria-label="green circle">🟢</span> System Health Summary</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <strong>Overall Status:</strong><br />
                  <span className="badge bg-success">{health?.status || 'Unknown'}</span>
                </div>
                <div className="col-md-3">
                  <strong>Database Type:</strong><br />
                  <span className="badge bg-info">{health?.database || 'Unknown'}</span>
                </div>
                <div className="col-md-3">
                  <strong>Uptime:</strong><br />
                  {stats?.system && formatUptime(stats.system.uptime)}
                </div>
                <div className="col-md-3">
                  <strong>Memory Usage:</strong><br />
                  {stats?.system && formatMemory(stats.system.memory.heapUsed)} / {stats?.system && formatMemory(stats.system.memory.heapTotal)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-primary"><span role="img" aria-label="employees">👥</span> Employees</h5>
              <h2 className="text-primary">{stats?.employees?.total || 0}</h2>
              <p className="card-text">
                <small className="text-muted">
                  {stats?.employees?.supervisors || 0} supervisors
                </small>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-info"><span role="img" aria-label="locations">📍</span> Locations</h5>
              <h2 className="text-info">{stats?.locations?.total || 0}</h2>
              <p className="card-text">
                <small className="text-muted">Office locations</small>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-warning"><span role="img" aria-label="beach vacation">🏖️</span> Total Requests</h5>
              <h2 className="text-warning">{stats?.vacationRequests?.total || 0}</h2>
              <p className="card-text">
                <small className="text-muted">All time</small>
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-danger"><span role="img" aria-label="denial reasons">❌</span> Denial Reasons</h5>
              <h2 className="text-danger">{stats?.denialReasons?.active || 0}</h2>
              <p className="card-text">
                <small className="text-muted">Active reasons</small>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Request Status Overview */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h5><span role="img" aria-label="clipboard">📋</span> Vacation Request Status</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-4">
                  <div className="mb-2">
                    <span 
                      className="badge fs-6 p-2" 
                      style={{ backgroundColor: getStatusColor('pending') }}
                    >
                      Pending: {stats?.vacationRequests?.pending || 0}
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="mb-2">
                    <span 
                      className="badge fs-6 p-2" 
                      style={{ backgroundColor: getStatusColor('approved') }}
                    >
                      Approved: {stats?.vacationRequests?.approved || 0}
                    </span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="mb-2">
                    <span 
                      className="badge fs-6 p-2" 
                      style={{ backgroundColor: getStatusColor('denied') }}
                    >
                      Denied: {stats?.vacationRequests?.denied || 0}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Progress bar visualization */}
              <div className="progress mt-3" style={{ height: '25px' }}>
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${((stats?.vacationRequests?.pending || 0) / (stats?.vacationRequests?.total || 1)) * 100}%`,
                    backgroundColor: getStatusColor('pending')
                  }}
                >
                  {stats?.vacationRequests?.pending || 0}
                </div>
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${((stats?.vacationRequests?.approved || 0) / (stats?.vacationRequests?.total || 1)) * 100}%`,
                    backgroundColor: getStatusColor('approved')
                  }}
                >
                  {stats?.vacationRequests?.approved || 0}
                </div>
                <div 
                  className="progress-bar" 
                  style={{ 
                    width: `${((stats?.vacationRequests?.denied || 0) / (stats?.vacationRequests?.total || 1)) * 100}%`,
                    backgroundColor: getStatusColor('denied')
                  }}
                >
                  {stats?.vacationRequests?.denied || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5><span role="img" aria-label="computer">💻</span> System Info</h5>
            </div>
            <div className="card-body">
              <p><strong>Node.js:</strong> {stats?.system?.nodeVersion}</p>
              <p><strong>Heap Used:</strong> {stats?.system && formatMemory(stats.system.memory.heapUsed)}</p>
              <p><strong>External:</strong> {stats?.system && formatMemory(stats.system.memory.external)}</p>
              <p><strong>RSS:</strong> {stats?.system && formatMemory(stats.system.memory.rss)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><span role="img" aria-label="clock">🕒</span> Recent Vacation Requests</h5>
            </div>
            <div className="card-body">
              {stats?.vacationRequests?.recent?.length > 0 ? (
                <div className="list-group list-group-flush">
                  {stats.vacationRequests.recent.map((request, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-1">{request.employee}</h6>
                        <p className="mb-1">
                          {new Date(request.start_date).toLocaleDateString()} ({request.days} days)
                        </p>
                        <small className="text-muted">
                          {new Date(request.created).toLocaleDateString()}
                        </small>
                      </div>
                      <span 
                        className="badge rounded-pill" 
                        style={{ backgroundColor: getStatusColor(request.status) }}
                      >
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No recent requests</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h5><span role="img" aria-label="trophy">🏆</span> Top Requesters</h5>
            </div>
            <div className="card-body">
              {activity?.topRequesters?.length > 0 ? (
                <div className="list-group list-group-flush">
                  {activity.topRequesters.map((requester, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{requester.employee}</h6>
                        <small className="text-muted">{requester.totalDays} total days</small>
                      </div>
                      <span className="badge bg-primary rounded-pill">
                        {requester.requests} requests
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No data available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5><span role="img" aria-label="lightning">⚡</span> Quick Actions</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="btn btn-outline-primary w-100 mb-2">
                    <span role="img" aria-label="link">🔗</span> View API Documentation
                  </a>
                </div>
                <div className="col-md-3">
                  <a href="http://localhost:3001/health" target="_blank" rel="noopener noreferrer" className="btn btn-outline-success w-100 mb-2">
                    <span role="img" aria-label="heart">❤️</span> Health Check
                  </a>
                </div>
                <div className="col-md-3">
                  <a href="http://localhost:3001/api/dashboard/stats" target="_blank" rel="noopener noreferrer" className="btn btn-outline-info w-100 mb-2">
                    <span role="img" aria-label="chart">📊</span> Raw Stats API
                  </a>
                </div>
                <div className="col-md-3">
                  <button className="btn btn-outline-warning w-100 mb-2" onClick={fetchDashboardData}>
                    <span role="img" aria-label="refresh">🔄</span> Force Refresh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;