
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { requireAuth, hasRole, getCurrentUser } from '../utils/auth';
import { verifyPass, getPass } from '../utils/passData';

const VerifyPass = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  
  const [passId, setPassId] = useState('');
  const [result, setResult] = useState(null);
  const [pass, setPass] = useState(null);
  
  useEffect(() => {
    if (!requireAuth(navigate)) {
      return;
    }
    
    // Only security staff can access this page
    if (!hasRole('security')) {
      navigate('/dashboard');
    }
  }, [navigate]);
  
  const handleVerify = (e) => {
    e.preventDefault();
    
    if (!passId) {
      return;
    }
    
    const verification = verifyPass(passId);
    setResult(verification);
    
    if (verification.valid) {
      setPass(verification.pass);
    } else {
      setPass(null);
    }
  };
  
  if (!user || !hasRole('security')) {
    return null;
  }
  
  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>Verify Gate Pass</h2>
          
          <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
            <form onSubmit={handleVerify}>
              <div className="form-group">
                <label className="form-label" htmlFor="passId">Enter Pass ID</label>
                <div style={{ display: 'flex' }}>
                  <input
                    id="passId"
                    type="text"
                    className="form-input"
                    value={passId}
                    onChange={(e) => setPassId(e.target.value)}
                    placeholder="e.g. GP001"
                    style={{ marginRight: '10px' }}
                  />
                  <button type="submit" className="btn btn-primary">
                    Verify
                  </button>
                </div>
              </div>
            </form>
            
            {result && (
              <div style={{
                backgroundColor: result.valid 
                  ? 'rgba(6, 214, 160, 0.1)' 
                  : 'rgba(255, 0, 110, 0.1)',
                color: result.valid ? 'var(--success)' : 'var(--danger)',
                padding: '20px',
                borderRadius: '4px',
                marginTop: '20px'
              }}>
                <h3 style={{ marginBottom: '10px' }}>
                  {result.valid ? 'Valid Pass' : 'Invalid Pass'}
                </h3>
                <p>{result.message || 'Pass verified successfully'}</p>
                
                {pass && (
                  <div style={{ marginTop: '20px' }}>
                    <h4 style={{ marginBottom: '10px' }}>Student Details</h4>
                    <p><strong>ID:</strong> {pass.studentId}</p>
                    <p><strong>Date:</strong> {pass.date}</p>
                    <p><strong>Time:</strong> {pass.time}</p>
                    <p><strong>Reason:</strong> {pass.reason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyPass;
