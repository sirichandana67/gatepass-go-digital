
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { requireAuth, getCurrentUser, hasRole } from '../utils/auth';
import { getFacultyPasses, updatePass, getStudentPasses } from '../utils/passData';
import { toast } from 'sonner';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [pendingPasses, setPendingPasses] = useState([]);
  const [approvedPasses, setApprovedPasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = getCurrentUser();
  
  useEffect(() => {
    if (!requireAuth(navigate)) {
      return;
    }
    
    if (!hasRole('faculty')) {
      navigate('/login');
      return;
    }
    
    // Get faculty priority from user object, default to 1 if not specified
    const facultyPriority = user?.priority || 1;
    
    const loadPasses = () => {
      console.log("Loading faculty passes...");
      // Get pending passes for faculty approval
      const facultyPasses = getFacultyPasses(facultyPriority);
      console.log("Faculty pending passes loaded:", facultyPasses);
      setPendingPasses(facultyPasses);
      
      // Get passes that were already approved by this faculty member
      const allPasses = facultyPasses.length > 0 && facultyPasses[0]?.studentId
        ? getStudentPasses(facultyPasses[0].studentId)
        : [];
        
      const alreadyApproved = allPasses.filter(p => 
        p.facultyApproval && (p.status === 'approved' || p.status === 'pending')
      );
      
      console.log("Faculty approved passes loaded:", alreadyApproved);
      setApprovedPasses(alreadyApproved);
      setLoading(false);
    };
    
    loadPasses();
    
    // Refresh data periodically to check for new passes or escalations
    const interval = setInterval(() => {
      loadPasses();
    }, 15000); // Every 15 seconds for testing purposes
    
    return () => clearInterval(interval);
  }, [navigate]); // Remove user from dependency array to prevent infinite loops
  
  const handleApprove = (passId) => {
    const updatedPass = updatePass(passId, { 
      facultyApproval: true,
      approvedBy: user.id,
      status: 'approved'
    });
    
    console.log("Pass approved:", updatedPass);
    toast.success("Gate pass approved successfully");
    
    // Move the approved pass from pending to approved list
    setPendingPasses(prev => prev.filter(p => p.id !== passId));
    setApprovedPasses(prev => [...prev, updatedPass]);
  };
  
  const handleReject = (passId) => {
    const updatedPass = updatePass(passId, { 
      status: 'rejected',
      facultyApproval: false
    });
    
    console.log("Pass rejected:", updatedPass);
    toast.error("Gate pass rejected");
    
    // Remove the rejected pass from the pending list
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
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Faculty Dashboard</h2>
          <p>Welcome, {user.name}</p>
          
          <div className="card">
            <h3 className="card-title">Pending Gate Pass Approvals</h3>
            
            {loading ? (
              <p>Loading approvals...</p>
            ) : pendingPasses.length === 0 ? (
              <p>No pending approvals at this time.</p>
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
          
          <div className="card mt-20">
            <h3 className="card-title">Approved Requests</h3>
            
            {loading ? (
              <p>Loading approved passes...</p>
            ) : approvedPasses.length === 0 ? (
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
                      <p><strong>Student ID:</strong> {pass.studentId}</p>
                      <p><strong>Date:</strong> {pass.date}</p>
                      <p><strong>Time:</strong> {pass.time}</p>
                      <p><strong>Reason:</strong> {pass.reason}</p>
                      <p><strong>Parent Approval:</strong> <span style={{ color: 'green' }}>Approved</span></p>
                      <p><strong>Faculty Approval:</strong> <span style={{ color: 'green' }}>Approved</span></p>
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
