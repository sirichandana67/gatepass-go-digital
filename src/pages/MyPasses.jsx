
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PassCard from '../components/PassCard';
import { requireAuth, getCurrentUser } from '../utils/auth';
import { getStudentPasses } from '../utils/passData';

const MyPasses = () => {
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
  
  const passes = getStudentPasses(user.id);
  
  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <h2 style={{ fontSize: '1.8rem', marginBottom: '20px' }}>My Gate Passes</h2>
          
          {passes.length > 0 ? (
            <div className="pass-container">
              {passes.map(pass => (
                <PassCard key={pass.id} pass={pass} />
              ))}
            </div>
          ) : (
            <div className="card">
              <p>You don't have any gate passes yet.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyPasses;
