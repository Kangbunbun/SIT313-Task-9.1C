import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    setErr("");
    setMsg("");
    const em = email.trim().toLowerCase();

    try {
      setLoading(true);

      // Lấy danh sách user từ localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];

      // Tìm user
      const user = users.find(u => u.email === em && u.password === pw);
      if (!user) {
        setErr("Invalid email or password.");
        return;
      }

      // Lưu current user
      localStorage.setItem("currentUser", JSON.stringify(user));

      setMsg("Login successful! Redirecting to Home...");
      setTimeout(() => nav("/home"), 1000);
    } catch (e) {
      setErr("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrap">
      <form className="card" onSubmit={onSubmit}>
        <h1>Login</h1>

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <label>Password</label>
        <input
          type="password"
          value={pw}
          onChange={(e)=>setPw(e.target.value)}
          required
          disabled={loading}
        />

        {err && <p className="err">{err}</p>}
        {msg && <p className="success">{msg}</p>}

        <button className="btn primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="muted">
          No account? <Link to="/signup">Sign up</Link>
        </p>
      </form>
    </div>
  );
}
