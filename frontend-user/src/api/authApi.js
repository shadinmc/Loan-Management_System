export const login = ({ email, password }) => {
  if (email && password) {
    localStorage.setItem("token", "mock-token");
    localStorage.setItem("user", JSON.stringify({ email }));
    return Promise.resolve({ success: true });
  }
  return Promise.reject("Invalid credentials");
};

export const signup = (data) => {
  console.log("Mock signup data:", data);
  return Promise.resolve({ success: true });
};

export const logout = () => {
  localStorage.clear();
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};
