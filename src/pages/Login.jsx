import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setErr("");
    setMsg("");

    const em = email.trim().toLowerCase();
    if (!em || !pw) {
      setErr("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, em, pw);
      setMsg("Login successful! Redirecting to Home...");
      setTimeout(() => nav("/home"), 1000);
    } catch (e) {
      console.error("[Login] failed:", e?.code, e?.message);
      const code = e?.code || "";
      if (code === "auth/wrong-password" || code === "auth/invalid-credential") {
        setErr("Invalid email or password.");
      } else if (code === "auth/user-not-found") {
        setErr("No account found with this email.");
      } else if (code === "auth/too-many-requests") {
        setErr("Too many attempts. Please try again later.");
      } else if (code === "auth/invalid-email") {
        setErr("Invalid email format.");
      } else {
        setErr(e?.message?.replace("Firebase: ", "") || "Login failed.");
      }
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
