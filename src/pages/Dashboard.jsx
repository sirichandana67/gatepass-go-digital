
import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PassCard from '../components/PassCard';
import { requireAuth, getCurrentUser, hasRole } from '../utils/auth';
import { getStudentPasses, getStats } from '../utils/passData';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  useEffect(() => {
    if (!requireAuth(navigate)) {
      return;
    }
  }, [navigate]);
  
  if (!user) {
    return null;
  }
  
  const stats = getStats(user.id);
  const passes = getStudentPasses(user.id).slice(0, 2); // Show only 2 most recent passes
  
  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="flex-between mb-20">
            <h2 style={{ fontSize: '1.8rem' }}>Welcome, {user.name}</h2>
            <Link to="/request-pass" className="btn btn-primary">New Gate Pass</Link>
          </div>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Total Passes</h3>
              <div className="stat-value">{stats.total}</div>
            </div>
            
            <div className="stat-card">
              <h3>Approved</h3>
              <div className="stat-value">{stats.approved}</div>
            </div>
            
            <div className="stat-card">
              <h3>Pending</h3>
              <div className="stat-value">{stats.pending}</div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex-between mb-20">
              <h2 className="card-title">Recent Gate Passes</h2>
              <Link to="/my-passes">View All Passes</Link>
            </div>
            
            {passes.length > 0 ? (
              <div className="pass-container">
                {passes.map(pass => (
                  <PassCard key={pass.id} pass={pass} />
                ))}
              </div>
            ) : (
              <p>You don't have any gate passes yet.</p>
            )}
          </div>
          
          {hasRole('security') && (
            <div className="mt-20">
              <div className="card">
                <h2 className="card-title">Security Actions</h2>
                <Link to="/verify" className="btn btn-primary">Verify Pass</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
