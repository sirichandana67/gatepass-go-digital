
// Mock pass data

let passes = [
  {
    id: 'GP001',
    studentId: 1,
    date: '2025-05-03',
    time: '2:30 PM - 5:00 PM',
    reason: 'Doctor appointment',
    status: 'approved',
    createdAt: '2025-05-01',
    approvedBy: 'faculty',
    parentApproval: true,
    facultyApproval: true
  },
  {
    id: 'GP002',
    studentId: 1,
    date: '2025-05-10',
    time: '10:00 AM - 12:00 PM',
    reason: 'Family emergency',
    status: 'pending',
    createdAt: '2025-05-02',
    approvedBy: null,
    parentApproval: false,
    facultyApproval: false,
    currentApprover: 'parent',
    facultyNotificationTime: null
  }
];

// Get all passes for a student
export const getStudentPasses = (studentId) => {
  return passes.filter(pass => pass.studentId === studentId);
};

// Get passes for approval by parent
export const getParentPasses = (parentUserId) => {
  // In a real app, you'd fetch the student IDs linked to this parent
  // For now, we'll use the mock data
  const parentUser = require('./auth').users.find(u => u.id === parentUserId);
  if (!parentUser || !parentUser.studentId) return [];
  
  return passes.filter(pass => 
    pass.studentId === parentUser.studentId && 
    pass.status === 'pending' && 
    pass.currentApprover === 'parent'
  );
};

// Get passes for faculty approval
export const getFacultyPasses = (facultyPriority) => {
  return passes.filter(pass => 
    pass.status === 'pending' && 
    pass.parentApproval === true && 
    !pass.facultyApproval &&
    pass.currentApprover === 'faculty' &&
    (!pass.facultyNotificationTime || 
     (facultyPriority > 1 && isTimeExceeded(pass.facultyNotificationTime, 15)))
  );
};

// Check if time exceeded minutes
function isTimeExceeded(timeString, minutes) {
  if (!timeString) return false;
  
  const time = new Date(timeString);
  const now = new Date();
  const diffInMinutes = (now - time) / (1000 * 60);
  
  return diffInMinutes > minutes;
}

// Get a specific pass
export const getPass = (passId) => {
  return passes.find(pass => pass.id === passId);
};

// Create a new pass
export const createPass = (passData) => {
  const newPass = {
    ...passData,
    id: `GP${String(passes.length + 1).padStart(3, '0')}`,
    status: 'pending',
    createdAt: new Date().toISOString().split('T')[0],
    approvedBy: null,
    parentApproval: false,
    facultyApproval: false,
    currentApprover: 'parent',
    facultyNotificationTime: null
  };
  
  passes = [...passes, newPass];
  return newPass;
};

// Update a pass (for admin approval)
export const updatePass = (passId, updates) => {
  passes = passes.map(pass => {
    if (pass.id === passId) {
      const updatedPass = { ...pass, ...updates };
      
      // Handle approval workflow
      if (updates.parentApproval && !pass.parentApproval) {
        updatedPass.currentApprover = 'faculty';
        updatedPass.facultyNotificationTime = new Date().toISOString();
      }
      
      if (updates.facultyApproval) {
        updatedPass.status = 'approved';
      }
      
      if (updatedPass.parentApproval && updatedPass.facultyApproval) {
        updatedPass.status = 'approved';
      }
      
      return updatedPass;
    }
    return pass;
  });
  
  return getPass(passId);
};

// Verify a pass
export const verifyPass = (passId) => {
  const pass = getPass(passId);
  
  if (!pass) {
    return { valid: false, message: 'Invalid pass' };
  }
  
  if (pass.status !== 'approved') {
    return { valid: false, message: 'Pass not approved' };
  }
  
  const today = new Date().toISOString().split('T')[0];
  if (pass.date !== today) {
    return { valid: false, message: 'Pass not valid for today' };
  }
  
  return { valid: true, pass };
};

// Get statistics
export const getStats = (studentId) => {
  const studentPasses = getStudentPasses(studentId);
  
  return {
    total: studentPasses.length,
    approved: studentPasses.filter(p => p.status === 'approved').length,
    pending: studentPasses.filter(p => p.status === 'pending').length,
    rejected: studentPasses.filter(p => p.status === 'rejected').length
  };
};

// Check and update faculty notification times
export const updateFacultyNotifications = () => {
  const now = new Date();
  
  passes = passes.map(pass => {
    if (pass.status === 'pending' && 
        pass.parentApproval && 
        !pass.facultyApproval &&
        pass.currentApprover === 'faculty' &&
        pass.facultyNotificationTime) {
          
      const notificationTime = new Date(pass.facultyNotificationTime);
      const diffInMinutes = (now - notificationTime) / (1000 * 60);
      
      if (diffInMinutes > 15) {
        // Escalate to next faculty
        return {
          ...pass,
          facultyPriority: 2,
          facultyNotificationTime: now.toISOString()
        };
      }
    }
    
    return pass;
  });
};

// This would be called by a timer in a real app
setInterval(updateFacultyNotifications, 60000); // Check every minute
