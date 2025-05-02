
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { requireAuth, getCurrentUser } from '../utils/auth';
import { createPass } from '../utils/passData';

const RequestPass = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    reason: ''
  });
  const [success, setSuccess] = useState(false);
  
  useEffect(() => {
    if (!requireAuth(navigate)) {
      return;
    }
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData(prev => ({
      ...prev,
      date: tomorrow.toISOString().split('T')[0]
    }));
  }, [navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.date || !formData.time || !formData.reason) {
      alert('Please fill all fields');
      return;
    }
    
    // Create the pass
    createPass({
      studentId: user.id,
      ...formData
    });
    
    setSuccess(true);
    
    // Reset form
    setFormData({
      date: '',
      time: '',
      reason: ''
    });
    
    // Redirect after 2 seconds
    setTimeout(() => {
      navigate('/my-passes');
    }, 3000);
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h2 className="card-title">Request Gate Pass</h2>
            
            {success ? (
              <div style={{
                backgroundColor: 'rgba(6, 214, 160, 0.1)',
                color: 'var(--success)',
                padding: '20px',
                borderRadius: '4px',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                <p style={{ fontSize: '18px', marginBottom: '10px' }}>Gate pass request submitted successfully!</p>
                <p style={{ marginBottom: '10px' }}>Your request will be sent to your parent for approval first.</p>
                <p style={{ marginBottom: '10px' }}>After parent approval, it will be forwarded to faculty for final approval.</p>
                <p>Redirecting to your passes...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="date">Date</label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    className="form-input"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="time">Time Slot</label>
                  <select
                    id="time"
                    name="time"
                    className="form-select"
                    value={formData.time}
                    onChange={handleChange}
                  >
                    <option value="">Select a time slot</option>
                    <option value="9:00 AM - 12:00 PM">9:00 AM - 12:00 PM</option>
                    <option value="12:00 PM - 3:00 PM">12:00 PM - 3:00 PM</option>
                    <option value="3:00 PM - 6:00 PM">3:00 PM - 6:00 PM</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label" htmlFor="reason">Reason</label>
                  <textarea
                    id="reason"
                    name="reason"
                    className="form-input"
                    value={formData.reason}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Please provide a reason for your gate pass request"
                  ></textarea>
                </div>
                
                <div className="info-box" style={{ 
                  backgroundColor: '#f8f9fa', 
                  padding: '10px', 
                  borderRadius: '4px', 
                  marginBottom: '20px',
                  border: '1px solid #dee2e6'
                }}>
                  <p><strong>Note:</strong> Your request requires both parent and faculty approval before it becomes active.</p>
                </div>
                
                <div className="text-center">
                  <button type="submit" className="btn btn-primary">
                    Submit Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RequestPass;
