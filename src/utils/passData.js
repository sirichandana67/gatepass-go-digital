
// Mock pass data
import { getCurrentUser } from './auth';

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
    facultyApproval: true,
    notifications: {
      student: true,
      parent: true
    }
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
    parentApproval: true,  // Set to true so it appears in faculty dashboard
    facultyApproval: false,
    currentApprover: 'faculty',  // Set to faculty so it appears in faculty dashboard
    facultyNotificationTime: new Date().toISOString(),
    notifications: {
      student: false,
      parent: true
    }
  }
];

// Get all passes for a student
export const getStudentPasses = (studentId) => {
  return passes.filter(pass => pass.studentId === studentId);
};

// Get passes for approval by parent
export const getParentPasses = (parentUserId) => {
  // We get the current user directly without using require
  const parentUser = getCurrentUser();
  if (!parentUser || !parentUser.studentId) return [];
  
  return passes.filter(pass => 
    pass.studentId === parentUser.studentId && 
    pass.status === 'pending' && 
    pass.currentApprover === 'parent'
  );
};

// Get passes for faculty approval
export const getFacultyPasses = (facultyPriority) => {
  console.log("Getting faculty passes with priority:", facultyPriority);
  console.log("Current passes:", passes);
  
  const facultyPasses = passes.filter(pass => 
    pass.status === 'pending' && 
    pass.parentApproval === true && 
    !pass.facultyApproval &&
    pass.currentApprover === 'faculty' &&
    (!pass.facultyNotificationTime || 
     (facultyPriority > 1 && isTimeExceeded(pass.facultyNotificationTime, 15)))
  );
  
  console.log("Faculty passes filtered:", facultyPasses);
  return facultyPasses;
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
    facultyNotificationTime: null,
    notifications: {
      student: false,
      parent: false
    }
  };
  
  passes = [...passes, newPass];
  console.log("New pass created:", newPass);
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
        updatedPass.notifications = {
          ...updatedPass.notifications,
          parent: true
        };
        console.log("Pass escalated to faculty approval:", updatedPass);
      }
      
      if (updates.facultyApproval) {
        updatedPass.status = 'approved';
        updatedPass.notifications = {
          ...updatedPass.notifications,
          student: true
        };
        console.log("Pass fully approved, student notified:", updatedPass);
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

// Get notifications for a student
export const getStudentNotifications = (studentId) => {
  return passes.filter(pass => 
    pass.studentId === studentId && 
    pass.notifications?.student === true
  );
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
