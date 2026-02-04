// Mock admin users (frontend-only)
const MOCK_ADMINS = [
  {
    email: "admin@example.com",
    password: "admin123",
    role: "BRANCH_MANAGER",
    name: "Rajesh Kumar"
  }
];

// Mock login
export const login = (email, password) => {
  const user = MOCK_ADMINS.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  localStorage.setItem("adminAuth", JSON.stringify(user));
  return user;
};

// Mock logout
export const logout = () => {
  localStorage.removeItem("adminAuth");
};

// Get logged-in admin
export const getCurrentUser = () => {
  const data = localStorage.getItem("adminAuth");
  return data ? JSON.parse(data) : null;
};
