
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { isLoggedIn, logout, hasRole } from '../utils/auth';

const Navbar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">GatePass</Link>
        <ul className="navbar-menu">
          {!isLoggedIn() ? (
            <>
              <li className="navbar-item">
                <Link to="/" className={`navbar-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
              </li>
              <li className="navbar-item">
                <Link to="/login" className={`navbar-link ${isActive('/login') ? 'active' : ''}`}>Student Login</Link>
              </li>
              <li className="navbar-item">
                <Link to="/parent-login" className={`navbar-link ${isActive('/parent-login') ? 'active' : ''}`}>Parent Login</Link>
              </li>
              <li className="navbar-item">
                <Link to="/faculty-login" className={`navbar-link ${isActive('/faculty-login') ? 'active' : ''}`}>Faculty Login</Link>
              </li>
            </>
          ) : (
            <>
              {hasRole('student') && (
                <>
                  <li className="navbar-item">
                    <Link to="/dashboard" className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/request-pass" className={`navbar-link ${isActive('/request-pass') ? 'active' : ''}`}>Request Pass</Link>
                  </li>
                  <li className="navbar-item">
                    <Link to="/my-passes" className={`navbar-link ${isActive('/my-passes') ? 'active' : ''}`}>My Passes</Link>
                  </li>
                </>
              )}
              
              {hasRole('parent') && (
                <li className="navbar-item">
                  <Link to="/parent-dashboard" className={`navbar-link ${isActive('/parent-dashboard') ? 'active' : ''}`}>Parent Dashboard</Link>
                </li>
              )}
              
              {hasRole('faculty') && (
                <li className="navbar-item">
                  <Link to="/faculty-dashboard" className={`navbar-link ${isActive('/faculty-dashboard') ? 'active' : ''}`}>Faculty Dashboard</Link>
                </li>
              )}
              
              {hasRole('security') && (
                <li className="navbar-item">
                  <Link to="/verify" className={`navbar-link ${isActive('/verify') ? 'active' : ''}`}>Verify Pass</Link>
                </li>
              )}
              
              <li className="navbar-item">
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  logout();
                  window.location.href = '/';
                }} className="navbar-link">Logout</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
