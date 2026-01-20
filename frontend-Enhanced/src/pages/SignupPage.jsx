import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PHONE_REGEX = /^\d{10}$/;

export default function SignupPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.body.style.background =
        theme === "light" ? "#f9fafb" : "#0f172a";
    document.body.style.transition = "background 0.3s ease";
  }, [theme]);

  const validate = () => {
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address.";
    if (!PHONE_REGEX.test(phoneNumber)) return "Phone number must be exactly 10 digits.";
    if (!password || password.length < 6) return "Password must be at least 6 characters.";
    if (!name.trim()) return "Name is required.";
    if (!address.trim()) return "Address is required.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const endpoint =
          role === "ADMIN"
              ? `${process.env.REACT_APP_API_URL}/auth/admin/signup`
              : `${process.env.REACT_APP_API_URL}/auth/signup`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, phoneNumber, address }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Signup failed");
      }

      const data = await res.json();
      login(data);

      if (data.role === "ADMIN") navigate("/admin/restaurants");
      else navigate("/restaurants");
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  };

  const isEmailValid = EMAIL_REGEX.test(email);
  const isPhoneValid = PHONE_REGEX.test(phoneNumber);

  const canSubmit =
      isEmailValid &&
      isPhoneValid &&
      name.trim() &&
      address.trim() &&
      password.length >= 6;

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Inter, system-ui, sans-serif",
      color: theme === "light" ? "#111827" : "#f9fafb",
      transition: "color 0.3s ease",
    },
    card: {
      position: "relative",
      width: "100%",
      maxWidth: "420px",
      background: theme === "light" ? "#ffffff" : "#1e293b",
      padding: "36px",
      borderRadius: "16px",
      boxShadow: "0 12px 32px rgba(0,0,0,0.15)",
      transition: "background 0.3s ease",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "28px",
    },
    input: {
      width: "100%",
      padding: "12px",
      marginTop: "6px",
      marginBottom: "20px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      outline: "none",
      background: theme === "light" ? "#f9fafb" : "#334155",
      color: "inherit",
      transition: "all 0.2s ease",
    },
    select: {
      width: "100%",
      padding: "12px",
      marginTop: "6px",
      marginBottom: "20px",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      background: theme === "light" ? "#f9fafb" : "#334155",
      color: "inherit",
    },
    button: {
      width: "100%",
      padding: "12px",
      background: canSubmit ? "#ff6b35" : "#9ca3af",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: canSubmit ? "pointer" : "not-allowed",
      transition: "background 0.2s ease",
    },
    link: {
      color: "#ff6b35",
      textDecoration: "none",
      fontWeight: "500",
    },
    error: {
      background: "#fee2e2",
      color: "#b91c1c",
      fontSize: "14px",
      padding: "8px",
      borderRadius: "6px",
      marginBottom: "14px",
    },
    themeBtn: {
      border: "none",
      background: "transparent",
      fontSize: "22px",
      cursor: "pointer",
      transition: "transform 0.2s ease",
    },
  };

  return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.header}>
            <h2 style={{ margin: 0 }}>📝 Signup</h2>

          </div>

          {error && <p style={styles.error}>{error}</p>}

          <form onSubmit={handleSubmit} noValidate>
            <label>Name</label>
            <input
                style={styles.input}
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
            />

            <label>Email</label>
            <input
                style={styles.input}
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
            />
            {!isEmailValid && email && (
                <small style={{ color: "crimson" }}>Invalid email format</small>
            )}

            <label>Phone</label>
            <input
                style={styles.input}
                type="text"
                value={phoneNumber}
                required
                maxLength={10}
                inputMode="numeric"
                onChange={(e) =>
                    setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="10-digit phone number"
            />
            {!isPhoneValid && phoneNumber && (
                <small style={{ color: "crimson" }}>
                  Phone number must be exactly 10 digits
                </small>
            )}

            <label>Address</label>
            <input
                style={styles.input}
                type="text"
                value={address}
                required
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Address"
            />

            <label>Role</label>
            <select
                style={styles.select}
                value={role}
                onChange={(e) => setRole(e.target.value)}
            >
              <option value="CUSTOMER">Customer</option>
              <option value="ADMIN">Admin</option>
            </select>

            <label>Password</label>
            <input
                style={styles.input}
                type="password"
                value={password}
                required
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
            />

            <button style={styles.button} type="submit" disabled={!canSubmit}>
              Signup
            </button>
          </form>

          <p style={{ marginTop: "20px", textAlign: "center" }}>
            Already have an account?{" "}
            <Link style={styles.link} to="/login">
              Login
            </Link>
          </p>
        </div>
      </div>
  );
}
