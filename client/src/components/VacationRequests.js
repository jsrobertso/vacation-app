import React, { useState, useEffect } from 'react';
import { vacationRequestAPI, employeeAPI, denialReasonAPI } from '../services/api';

function VacationRequests() {
  const [requests, setRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [denialReasons, setDenialReasons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDenialModal, setShowDenialModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [formData, setFormData] = useState({
    employee_id: '',
    start_date: '',
    end_date: '',
    reason: ''
  });
  const [denialData, setDenialData] = useState({
    denial_reason_id: '',
    denial_comments: '',
    supervisor_id: 1
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [requestsRes, employeesRes, denialReasonsRes] = await Promise.all([
        vacationRequestAPI.getAll(),
        employeeAPI.getAll(),
        denialReasonAPI.getAll()
      ]);
      setRequests(requestsRes.data);
      setEmployees(employeesRes.data);
      setDenialReasons(denialReasonsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const startDate = new Date(formData.start_date);
      const endDate = new Date(formData.end_date);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      
      await vacationRequestAPI.create({
        ...formData,
        days_requested: days
      });
      
      setFormData({ employee_id: '', start_date: '', end_date: '', reason: '' });
      setShowForm(false);
      fetchData();
    } catch (error) {
      console.error('Error creating request:', error);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      await vacationRequestAPI.approve(requestId, 1);
      fetchData();
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDenyClick = (request) => {
    setSelectedRequest(request);
    setShowDenialModal(true);
  };

  const handleDeny = async () => {
    try {
      await vacationRequestAPI.deny(selectedRequest.id, denialData);
      setShowDenialModal(false);
      setDenialData({ denial_reason_id: '', denial_comments: '', supervisor_id: 1 });
      fetchData();
    } catch (error) {
      console.error('Error denying request:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Vacation Requests</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            New Request
          </button>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Location</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Days</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(request => (
              <tr key={request.id}>
                <td>{request.first_name} {request.last_name}</td>
                <td>{request.location_name}</td>
                <td>{formatDate(request.start_date)}</td>
                <td>{formatDate(request.end_date)}</td>
                <td>{request.days_requested}</td>
                <td>
                  <span className={`status-badge status-${request.status}`}>
                    {request.status}
                  </span>
                </td>
                <td>
                  {request.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-success"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </button>
                      <button 
                        className="btn btn-danger"
                        onClick={() => handleDenyClick(request)}
                      >
                        Deny
                      </button>
                    </>
                  )}
                  {request.status === 'denied' && request.denial_reason && (
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Reason: {request.denial_reason}
                      {request.denial_comments && <div>Comments: {request.denial_comments}</div>}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">New Vacation Request</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Employee</label>
                <select 
                  className="form-select"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({...formData, employee_id: e.target.value})}
                  required
                >
                  <option value="">Select Employee</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.first_name} {emp.last_name} - {emp.location_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={formData.start_date}
                    onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input 
                    type="date"
                    className="form-input"
                    value={formData.end_date}
                    onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Reason</label>
                <textarea 
                  className="form-textarea"
                  value={formData.reason}
                  onChange={(e) => setFormData({...formData, reason: e.target.value})}
                  placeholder="Optional reason for vacation request"
                />
              </div>
              <div>
                <button type="submit" className="btn btn-primary">Submit Request</button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDenialModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Deny Vacation Request</h3>
            </div>
            <div className="form-group">
              <label className="form-label">Denial Reason</label>
              <select 
                className="form-select"
                value={denialData.denial_reason_id}
                onChange={(e) => setDenialData({...denialData, denial_reason_id: e.target.value})}
                required
              >
                <option value="">Select Reason</option>
                {denialReasons.map(reason => (
                  <option key={reason.id} value={reason.id}>
                    {reason.reason}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Additional Comments</label>
              <textarea 
                className="form-textarea"
                value={denialData.denial_comments}
                onChange={(e) => setDenialData({...denialData, denial_comments: e.target.value})}
                placeholder="Optional additional comments"
              />
            </div>
            <div>
              <button className="btn btn-danger" onClick={handleDeny}>
                Deny Request
              </button>
              <button className="btn btn-secondary" onClick={() => setShowDenialModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VacationRequests;