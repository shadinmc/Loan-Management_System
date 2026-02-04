import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // ---- MOCK VALIDATION ----
    if (email === "admin@example.com" && password === "admin123") {
      // store mock auth
      localStorage.setItem(
        "adminAuth",
        JSON.stringify({ email, role: "ADMIN" })
      );

      // navigate to dashboard
      navigate("/admin/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">🔒</div>

        <h2>Loan Management</h2>
        <p className="subtitle">Admin Portal</p>

        {error && <p className="error-text">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot-row">
            <a href="#">Forgot password?</a>
          </div>

          <button type="submit">Sign In</button>
        </form>

{/*         <p className="hint"> */}
{/*           Demo: <strong>admin@example.com / admin123</strong> */}
{/*         </p> */}
      </div>
    </div>
  );
};

export default AdminLogin;
