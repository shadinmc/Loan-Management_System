import { useState } from "react";
import { signup } from "../../api/authApi";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    await signup(form);
    navigate("/login");
  };

  return (
    <div>
      <h2>Signup</h2>
      {["username","firstname","lastname","email","mobile","password"].map(f => (
        <input key={f} name={f} placeholder={f} onChange={handleChange} />
      ))}
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
}
