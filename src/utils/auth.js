
// A simple authentication utility

// Mock user data
const users = [
  { id: 1, email: 'student@example.com', password: 'student123', role: 'student', name: 'John Student' },
  { id: 2, email: 'security@example.com', password: 'security123', role: 'security', name: 'Security Officer' }
];

// Login function
export const login = (email, password) => {
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // In a real app, you would use tokens and secure storage
    sessionStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }));
    return true;
  }
  
  return false;
};

// Logout function
export const logout = () => {
  sessionStorage.removeItem('currentUser');
};

// Get current user
export const getCurrentUser = () => {
  const userStr = sessionStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return !!getCurrentUser();
};

// Check if user has a specific role
export const hasRole = (role) => {
  const user = getCurrentUser();
  return user && user.role === role;
};

// Protected route utility
export const requireAuth = (navigate) => {
  if (!isLoggedIn()) {
    navigate('/login');
    return false;
  }
  return true;
};
