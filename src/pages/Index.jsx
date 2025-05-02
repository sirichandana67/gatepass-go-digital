
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { isLoggedIn, getCurrentUser } from '../utils/auth';

const Index = () => {
  const user = getCurrentUser();
  
  return (
    <>
      <Navbar />
      <div className="page">
        <div className="container">
          <div className="row">
            <div className="col col-6">
              <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Digital Gate Pass System</h1>
              <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                A quick and efficient way for students to request and receive gate passes
                for campus entry and exit.
              </p>
              
              {!isLoggedIn() ? (
                <div>
                  <Link to="/login" className="btn btn-primary" style={{ marginRight: '10px' }}>
                    Student Login
                  </Link>
                  <Link to="/login" className="btn btn-outline">
                    Security Login
                  </Link>
                </div>
              ) : (
                <div>
                  <Link to="/dashboard" className="btn btn-primary">
                    Go to Dashboard
                  </Link>
                </div>
              )}
            </div>
            
            <div className="col col-6">
              <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '20px' }}>How It Works</h2>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                  <div style={{ flex: '1', padding: '0 15px' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--primary)', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 15px auto',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>1</div>
                    <h3 style={{ marginBottom: '10px' }}>Request</h3>
                    <p>Submit your gate pass request with date, time and reason</p>
                  </div>
                  
                  <div style={{ flex: '1', padding: '0 15px' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--primary)', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 15px auto',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>2</div>
                    <h3 style={{ marginBottom: '10px' }}>Approval</h3>
                    <p>Get instant approval for routine requests</p>
                  </div>
                  
                  <div style={{ flex: '1', padding: '0 15px' }}>
                    <div style={{ 
                      width: '50px', 
                      height: '50px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--primary)', 
                      color: 'white', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      margin: '0 auto 15px auto',
                      fontSize: '20px',
                      fontWeight: 'bold'
                    }}>3</div>
                    <h3 style={{ marginBottom: '10px' }}>Use</h3>
                    <p>Show your digital pass at the gate for quick verification</p>
                  </div>
                </div>
                
                {!isLoggedIn() && (
                  <Link to="/login" className="btn btn-primary">Get Started</Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
