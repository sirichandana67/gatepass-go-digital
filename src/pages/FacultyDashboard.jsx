
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { requireAuth, getCurrentUser, hasRole } from '../utils/auth';
import { getFacultyPasses, updatePass } from '../utils/passData';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [passes, setPasses] = useState([]);
  
  useEffect(() => {
    if (!requireAuth(navigate)) {
      return;
    }
    
    if (!hasRole('faculty')) {
      navigate('/login');
      return;
    }
    
    // Get passes for faculty approval
    const facultyPasses = getFacultyPasses(user.priority);
    setPasses(facultyPasses);
    
    // Refresh data periodically to check for new passes or escalations
    const interval = setInterval(() => {
      setPasses(getFacultyPasses(user.priority));
    }, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [navigate, user]);
  
  const handleApprove = (passId) => {
    const updatedPass = updatePass(passId, { 
      facultyApproval: true,
      approvedBy: user.id
    });
    
    // Remove the approved pass from the list
    setPasses(prev => prev.filter(p => p.id !== passId));
  };
  
  const handleReject = (passId) => {
    const updatedPass = updatePass(passId, { 
      status: 'rejected',
      facultyApproval: false
    });
    
    // Remove the rejected pass from the list
    setPasses(prev => prev.filter(p => p.id !== passId));
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Faculty Dashboard</h2>
          <p>Welcome, {user.name}</p>
          
          <div className="card">
            <h3 className="card-title">Pending Gate Pass Approvals</h3>
            
            {passes.length === 0 ? (
              <p>No pending approvals at this time.</p>
            ) : (
              <div className="pass-container">
                {passes.map(pass => (
                  <div key={pass.id} className="pass-card">
                    <div className="pass-header">
                      <div className="flex-between">
                        <span>Gate Pass #{pass.id}</span>
                        <span className="pass-status status-pending">Pending</span>
                      </div>
                    </div>
                    <div className="pass-body">
                      <p><strong>Student ID:</strong> {pass.studentId}</p>
                      <p><strong>Date:</strong> {pass.date}</p>
                      <p><strong>Time:</strong> {pass.time}</p>
                      <p><strong>Reason:</strong> {pass.reason}</p>
                      <p><strong>Parent Approval:</strong> <span style={{ color: 'green' }}>Approved</span></p>
                      
                      <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button 
                          className="btn btn-primary"
                          onClick={() => handleApprove(pass.id)}
                        >
                          Approve
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleReject(pass.id)}
                          style={{ backgroundColor: '#ff4136' }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                    <div className="pass-footer">
                      <span>Created on: {pass.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FacultyDashboard;
