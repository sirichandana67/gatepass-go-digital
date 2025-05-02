
// Mock pass data

let passes = [
  {
    id: 'GP001',
    studentId: 1,
    date: '2025-05-03',
    time: '2:30 PM - 5:00 PM',
    reason: 'Doctor appointment',
    status: 'approved',
    createdAt: '2025-05-01'
  },
  {
    id: 'GP002',
    studentId: 1,
    date: '2025-05-10',
    time: '10:00 AM - 12:00 PM',
    reason: 'Family emergency',
    status: 'pending',
    createdAt: '2025-05-02'
  }
];

// Get all passes for a student
export const getStudentPasses = (studentId) => {
  return passes.filter(pass => pass.studentId === studentId);
};

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
    createdAt: new Date().toISOString().split('T')[0]
  };
  
  passes = [...passes, newPass];
  return newPass;
};

// Update a pass (for admin approval)
export const updatePass = (passId, updates) => {
  passes = passes.map(pass => 
    pass.id === passId ? { ...pass, ...updates } : pass
  );
  
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
