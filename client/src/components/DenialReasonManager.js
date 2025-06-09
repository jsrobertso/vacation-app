import React, { useState, useEffect } from 'react';
import { denialReasonAPI } from '../services/api';

const DenialReasonManager = () => {
  const [denialReasons, setDenialReasons] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingReason, setEditingReason] = useState(null);
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    active: true
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDenialReasons();
  }, []);

  const fetchDenialReasons = async () => {
    try {
      setLoading(true);
      const response = await denialReasonAPI.getAll();
      setDenialReasons(response.data);
    } catch (err) {
      setError('Failed to fetch denial reasons');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        active: formData.active === true || formData.active === 'true'
      };

      if (editingReason) {
        await denialReasonAPI.update(editingReason.id, submitData);
      } else {
        await denialReasonAPI.create(submitData);
      }
      
      fetchDenialReasons();
      resetForm();
    } catch (err) {
      setError('Failed to save denial reason');
      console.error(err);
    }
  };

  const handleEdit = (reason) => {
    setEditingReason(reason);
    setFormData({
      reason: reason.reason,
      description: reason.description || '',
      active: reason.active
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this denial reason?')) {
      try {
        await denialReasonAPI.delete(id);
        fetchDenialReasons();
      } catch (err) {
        setError('Failed to delete denial reason');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      reason: '',
      description: '',
      active: true
    });
    setEditingReason(null);
    setShowForm(false);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Denial Reason Management</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          Add Denial Reason
        </button>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Reason</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {denialReasons.map(reason => (
              <tr key={reason.id}>
                <td>{reason.reason}</td>
                <td>{reason.description || 'N/A'}</td>
                <td>
                  <span className={`badge ${reason.active ? 'bg-success' : 'bg-secondary'}`}>
                    {reason.active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(reason)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(reason.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingReason ? 'Edit Denial Reason' : 'Add Denial Reason'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label>Reason</label>
                    <input
                      type="text"
                      className="form-control"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Enter detailed description of the denial reason"
                    />
                  </div>
                  <div className="form-group mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        name="active"
                        checked={formData.active}
                        onChange={handleInputChange}
                        id="activeCheck"
                      />
                      <label className="form-check-label" htmlFor="activeCheck">
                        Active
                      </label>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingReason ? 'Update' : 'Create'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {showForm && <div className="modal-backdrop show"></div>}
    </div>
  );
};

export default DenialReasonManager;