import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

// MOCK USERS (temporary – backend/JWT will replace this)
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // find user from mock list
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      setError("Invalid username or password");
      return;
    }

    // store auth (JWT-ready structure)
    localStorage.setItem(
      "adminAuth",
      JSON.stringify({
        email: user.email,
        role: user.role,
        name: user.name
      })
    );

    // role-based navigation
    if (user.role === "BRANCH_MANAGER") {
      navigate("/admin/dashboard");
    } else if (user.role === "REGIONAL_MANAGER") {
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

       {/* HANDSHAKE IMAGE */}
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
          <div className="login-icon">🔒</div>

          <h2>Admin Login</h2>
          <p className="subtitle">Secure Access Portal</p>

          {error && <p className="error-text">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>

            <div className="login-links">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  alert(
                    "Password reset will be enabled after backend integration."
                  );
                }}
              >
                Forgot Password?
              </a>
            </div>
          </form>

          {/* MOCK CREDENTIALS INFO (REMOVE LATER) */}
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
