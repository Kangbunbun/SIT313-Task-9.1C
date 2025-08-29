import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase";
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
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (pw.length < 6) { setErr("Password must be at least 6 characters."); return; }

    try {
      setLoading(true);

      // 1) Tạo tài khoản nếu thành công => coi là "đăng ký thành công"
      const cred = await createUserWithEmailAndPassword(auth, em, pw);

      // 2) Cập nhật tên hiển thị
      await updateProfile(cred.user, { displayName: `${fn} ${ln}`.trim() });

      // 3) Lưu hồ sơ vào Firestore (nếu lỗi thì chỉ log, KHÔNG chặn luồng)
      try {
        await setDoc(doc(db, "users", cred.user.uid), {
          firstName: fn,
          lastName:  ln,
          email:     em,
          createdAt: serverTimestamp(),
        });
      } catch (fireErr) {
        console.warn("[Signup] Firestore write failed (ignored):", fireErr?.code || fireErr);
      }

      // 4) Thông báo & quay về Login (đáp ứng đúng yêu cầu bài)
      setMsg("Registration successful! Redirecting to Login...");
      setTimeout(() => nav("/login"), 1500);
    } catch (e) {
      console.error("[Signup] auth failed:", e?.code, e?.message);
      const code = e?.code || "";
      if (code === "auth/email-already-in-use") {
        setErr("This email is already registered. Please use another email or go to Login.");
      } else if (code === "auth/weak-password") {
        setErr("The password is too weak. Please use at least 6 characters.");
      } else {
        setErr(e?.message?.replace("Firebase: ", "") || "Sign up failed.");
      }
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
