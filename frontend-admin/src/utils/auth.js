//const MOCK_ADMINS = [
//  {
//    email: "admin@example.com",
//    password: "admin123",
//    role: "BRANCH_MANAGER",
//    name: "Rajesh Kumar"
//  },
//  {
//      email: "regional@example.com",
//      password: "regional123",
//      role: "REGIONAL_MANAGER",
//      name: "Priya Sharma"
//    }
//];
//
//
//export const login = (email, password) => {
//  const user = MOCK_ADMINS.find(
//    u => u.email === email && u.password === password
//  );
//
//  if (!user) {
//    throw new Error("Invalid credentials");
//  }
//
//  localStorage.setItem("adminAuth", JSON.stringify(user));
//  return user;
//};
//
//
//export const logout = () => {
//  localStorage.removeItem("adminAuth");
//};
//
//
//export const getCurrentUser = () => {
//  const data = localStorage.getItem("adminAuth");
//  return data ? JSON.parse(data) : null;
//};
//
//export const isAuthenticated = () => {
//  return !!localStorage.getItem("adminAuth");
//};
// ❌ NO MOCK DATA HERE

// Get full auth object returned by backend
export const getCurrentUser = () => {
  const data = localStorage.getItem("adminAuth");
  if (!data) return null;
  return JSON.parse(data);
};

// Check login status using token
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

// Logout user
export const logout = () => {
  localStorage.removeItem("adminAuth");
  localStorage.removeItem("token");
};
