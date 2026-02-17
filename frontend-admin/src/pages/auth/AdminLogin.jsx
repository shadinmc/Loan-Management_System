import { adminLogin } from "../../api/authApi";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminLogin.css";

// // MOCK USERS
// const mockUsers = [
//   {
//     email: "admin@example.com",
//     password: "admin123",
//     role: "BRANCH_MANAGER",
//     name: "Rajesh Kumar"
//   },
//   {
//     email: "regional@example.com",
//     password: "regional123",
//     role: "REGIONAL_MANAGER",
//     name: "Priya Sharma"
//   }
// ];

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  //  Clear previous session when login page loads
  useEffect(() => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("token");
  }, []);

 const handleSubmit = async (e) => {
   e.preventDefault();
   console.log("LOGIN SUBMITTED");
   setError("");

   try {
     const payload = {
       usernameOrEmail: email,   // backend expects this
       password: password,
     };

     const response = await adminLogin(payload);

     // Save full auth response
     localStorage.setItem("adminAuth", JSON.stringify(response));
     localStorage.setItem("token", response.token);

     const roles = response.roles || [];

     if (roles.includes("BRANCH_MANAGER")) {
       navigate("/admin/dashboard");
     } else if (roles.includes("REGIONAL_MANAGER")) {
       navigate("/regional/dashboard");
     } else {
       setError("You are not authorized to access admin portal");
     }

   } catch (err) {
     console.error(err);
     setError(
       err.response?.data?.message || "Invalid username or password"
     );
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

           <div className="password-field">
             <input
               type={showPassword ? "text" : "password"}
               placeholder="Enter password"
               value={password}
               onChange={(e) => {
                 setPassword(e.target.value);
                 setError("");
               }}
               required
             />

             <i
               className={`fa-solid ${
                 showPassword ? "fa-eye" : "fa-eye-slash"
               } password-toggle`}
               onClick={() => setShowPassword(!showPassword)}
               title={showPassword ? "Hide password" : "Show password"}
             ></i>
           </div>


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

{/*           <div style={{ marginTop: "16px", fontSize: "12px", color: "#64748b" }}> */}
{/*             <strong>Mock Logins:</strong> */}
{/*             <br /> */}
{/*             Branch: admin@example.com / admin123 */}
{/*             <br /> */}
{/*             Regional: regional@example.com / regional123 */}
{/*           </div> */}
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
