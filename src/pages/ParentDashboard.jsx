
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { requireAuth, getCurrentUser, hasRole } from '../utils/auth';
import { getParentPasses, updatePass, getStudentPasses } from '../utils/passData';

const ParentDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [pendingPasses, setPendingPasses] = useState([]);
  const [approvedPasses, setApprovedPasses] = useState([]);
  
  useEffect(() => {
    if (!requireAuth(navigate)) {
      return;
    }
    
    if (!hasRole('parent')) {
      navigate('/login');
      return;
    }
    
    // Load pending passes that need parent approval
    setPendingPasses(getParentPasses(user.id));
    
    // Load already approved passes for their student
    if (user.studentId) {
      const studentPasses = getStudentPasses(user.studentId);
      setApprovedPasses(studentPasses.filter(p => 
        p.parentApproval && (p.status === 'approved' || p.status === 'pending')
      ));
    }
  }, [navigate, user]);
  
  const handleApprove = (passId) => {
    const updatedPass = updatePass(passId, { 
      parentApproval: true,
      currentApprover: 'faculty'
    });
    
    // Move pass from pending to approved list
    setPendingPasses(prev => prev.filter(p => p.id !== passId));
    setApprovedPasses(prev => [...prev, updatedPass]);
  };
  
  const handleReject = (passId) => {
    updatePass(passId, { 
      status: 'rejected',
      parentApproval: false
    });
    
    // Remove from pending list
    setPendingPasses(prev => prev.filter(p => p.id !== passId));
  };
  
  if (!user) {
    return null;
  }
  
  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Parent Dashboard</h2>
          <p>Welcome, {user.name}</p>
          
          <div className="card">
            <h3 className="card-title">Pending Approval Requests</h3>
            
            {pendingPasses.length === 0 ? (
              <p>No pending approval requests at this time.</p>
            ) : (
              <div className="pass-container">
                {pendingPasses.map(pass => (
                  <div key={pass.id} className="pass-card">
                    <div className="pass-header">
                      <div className="flex-between">
                        <span>Gate Pass #{pass.id}</span>
                        <span className="pass-status status-pending">Pending</span>
                      </div>
                    </div>
                    <div className="pass-body">
                      <p><strong>Date:</strong> {pass.date}</p>
                      <p><strong>Time:</strong> {pass.time}</p>
                      <p><strong>Reason:</strong> {pass.reason}</p>
                      
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
          
          <div className="card mt-20">
            <h3 className="card-title">Approved Requests</h3>
            
            {approvedPasses.length === 0 ? (
              <p>No approved requests yet.</p>
            ) : (
              <div className="pass-container">
                {approvedPasses.map(pass => (
                  <div key={pass.id} className="pass-card">
                    <div className="pass-header">
                      <div className="flex-between">
                        <span>Gate Pass #{pass.id}</span>
                        <span className={`pass-status ${pass.status === 'approved' ? 'status-approved' : 'status-pending'}`}>
                          {pass.status.charAt(0).toUpperCase() + pass.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="pass-body">
                      <p><strong>Date:</strong> {pass.date}</p>
                      <p><strong>Time:</strong> {pass.time}</p>
                      <p><strong>Reason:</strong> {pass.reason}</p>
                      <p><strong>Parent Approval:</strong> <span style={{ color: 'green' }}>Approved</span></p>
                      <p><strong>Faculty Approval:</strong> {pass.facultyApproval ? 
                        <span style={{ color: 'green' }}>Approved</span> : 
                        <span style={{ color: 'orange' }}>Pending</span>}
                      </p>
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

export default ParentDashboard;
