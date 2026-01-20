import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;   // simple MVP
const PHONE_REGEX = /^\d{10}$/;         // exactly 10 digits

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

  // Client-side validation
  const validate = () => {
    if (!EMAIL_REGEX.test(email)) {
      return "Please enter a valid email address.";
    }
    if (!PHONE_REGEX.test(phoneNumber)) {
      return "Phone number must be exactly 10 digits.";
    }
    if (!password || password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    if (!name.trim()) {
      return "Name is required.";
    }
    if (!address.trim()) {
      return "Address is required.";
    }
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
          ? "http://localhost:8080/auth/admin/signup"
          : "http://localhost:8080/auth/signup";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          phoneNumber,
          address
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Signup failed");
      }

      const data = await res.json();
      login(data); // stores user + role

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

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Signup</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>

        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            required
            pattern="\S+@\S+\.\S+"
            title="Enter a valid email address"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
          />
          {!isEmailValid && email && (
            <small style={{ color: "crimson" }}>
              Invalid email format
            </small>
          )}
        </div>

        <div>
          <label>Phone</label>
          <input
            type="text"
            value={phoneNumber}
            required
            maxLength={10}
            inputMode="numeric"
            pattern="\d{10}"
            title="Phone number must be 10 digits"
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
        </div>

        <div>
          <label>Address</label>
          <input
            type="text"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />
        </div>

        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="CUSTOMER">Customer</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            required
            minLength={6}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />
        </div>

        <button type="submit" disabled={!canSubmit}>
          Signup
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
