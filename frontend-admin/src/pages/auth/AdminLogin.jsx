import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

// MOCK USERS
const mockUsers = [
  {
    email: "admin@example.com",
    password: "admin123",
    role: "BRANCH_MANAGER",
    name: "Rajesh Kumar"
  },
  {
    email: "regional@example.com",
    password: "regional123",
    role: "REGIONAL_MANAGER",
    name: "Priya Sharma"
  }
];

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ⭐ Clear previous session when login page loads
  useEffect(() => {
    localStorage.removeItem("adminAuth");
  }, []);

 const handleSubmit = (e) => {
   e.preventDefault();
   setError("");

   localStorage.removeItem("adminAuth");

   const user = mockUsers.find(
     (u) =>
       u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
       u.password.trim() === password.trim()
   );

   if (!user) {
     setError("Invalid username or password");
     return;
   }

   localStorage.setItem("adminAuth", JSON.stringify(user));

   if (user.role === "BRANCH_MANAGER") {
     navigate("/admin/dashboard");
   } else {
     navigate("/regional/dashboard");
   }
 };

  return (
    <div className="login-page">
      {/* LEFT SIDE */}
      <div className="login-left">
        <div className="brand-header">
          <div className="logo-circle">LMS</div>
          <span>Loan Management System</span>
        </div>

        <div className="login-illustration">
          <img
            src="/src/assets/customer-vendor2.png"
            alt="Customer and manager handshake"
          />
        </div>

        <div className="illustration-text">
          <h2>Secure Admin Access</h2>
          <p>
            Authorized personnel only. All activities are monitored and logged
            for compliance and audit purposes.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="login-right">
        <div className="login-card">


          <h2>Admin Login</h2>
          <p className="subtitle">Secure Access Portal</p>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              required
            />

            <button type="submit">Login</button>

            <div className="login-links">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert("Password reset will be enabled after backend integration.");
                }}
              >
                Forgot Password?
              </a>
            </div>
          </form>

          <div style={{ marginTop: "16px", fontSize: "12px", color: "#64748b" }}>
            <strong>Mock Logins:</strong>
            <br />
            Branch: admin@example.com / admin123
            <br />
            Regional: regional@example.com / regional123
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
