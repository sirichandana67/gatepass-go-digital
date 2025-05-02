
import React from 'react';
import { Link } from 'react-router-dom';
import QRCode from './QRCode';

const PassCard = ({ pass }) => {
  const getStatusClass = () => {
    switch(pass.status) {
      case 'approved':
        return 'status-approved';
      case 'pending':
        return 'status-pending';
      case 'rejected':
        return 'status-rejected';
      default:
        return '';
    }
  };

  return (
    <div className="pass-card">
      <div className="pass-header">
        <div className="flex-between">
          <span>Gate Pass #{pass.id}</span>
          <span className={`pass-status ${getStatusClass()}`}>
            {pass.status.charAt(0).toUpperCase() + pass.status.slice(1)}
          </span>
        </div>
      </div>
      <div className="pass-body">
        <p><strong>Date:</strong> {pass.date}</p>
        <p><strong>Time:</strong> {pass.time}</p>
        <p><strong>Reason:</strong> {pass.reason}</p>
        
        {pass.parentApproval !== undefined && (
          <p><strong>Parent Approval:</strong> {pass.parentApproval ? 
            <span style={{ color: 'green' }}>Approved</span> : 
            <span style={{ color: 'orange' }}>Pending</span>}
          </p>
        )}

        {pass.facultyApproval !== undefined && pass.parentApproval && (
          <p><strong>Faculty Approval:</strong> {pass.facultyApproval ? 
            <span style={{ color: 'green' }}>Approved</span> : 
            <span style={{ color: 'orange' }}>Pending</span>}
          </p>
        )}
        
        {pass.status === 'approved' && (
          <div className="text-center mt-20">
            <QRCode value={`GATEPASS-${pass.id}`} />
          </div>
        )}
      </div>
      <div className="pass-footer">
        <span>Created on: {pass.createdAt}</span>
        {pass.status === 'approved' && (
          <Link to={`/my-passes/${pass.id}`} className="btn btn-primary">View</Link>
        )}
      </div>
    </div>
  );
};

export default PassCard;
