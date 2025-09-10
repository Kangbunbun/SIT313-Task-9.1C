import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup() {
  const nav = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [pw,        setPw]        = useState("");
  const [err,       setErr]       = useState("");
  const [msg,       setMsg]       = useState("");
  const [loading,   setLoading]   = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErr(""); setMsg("");
    const em = email.trim().toLowerCase();

    if (pw.length < 6) { setErr("Password must be at least 6 characters."); return; }

    try {
      setLoading(true);

      // Lấy danh sách user từ localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Kiểm tra email trùng
      if (users.some(u => u.email === em)) {
        setErr("This email is already registered.");
        return;
      }

      // Thêm user mới
      const newUser = { firstName, lastName, email: em, password: pw };
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      setMsg("Registration successful! Redirecting to Login...");
      setTimeout(() => nav("/login"), 1500);
    } catch (e) {
      setErr("Sign up failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <form className="card" onSubmit={onSubmit}>
        <h1>Create a DEV@Deakin Account</h1>

        <label>First name*</label>
        <input value={firstName} onChange={(e)=>setFirstName(e.target.value)} required disabled={loading} />

        <label>Last name*</label>
        <input value={lastName} onChange={(e)=>setLastName(e.target.value)} required disabled={loading} />

        <label>Email*</label>
        <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required disabled={loading} />

        <label>Password*</label>
        <input type="password" value={pw} onChange={(e)=>setPw(e.target.value)} required disabled={loading} />

        {err && <p className="err">{err}</p>}
        {msg && <p className="success">{msg}</p>}

        <button className="btn primary" disabled={loading}>
          {loading ? "Creating..." : "Create"}
        </button>

        <p className="muted">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}
